const sequelize = require('sequelize');
const Op = sequelize.Op;
const {
    User,
    Active,
    Product,
    ProductImage,
    Location,
    Category,
    NewProduct,
    Review,
    Likes,
    Report,
} = require('../../models/Index');
const { paginate, paginateResponse } = require('../../utils/paginate');
const { getNproductPrice } = require('../../utils/apiHandler');
const { getLikes, postLikes, checkLikes } = require('../../service/likesService');
const { getReport, postReportProduct } = require('../../service/reportService');
const { isLoginUser, isWriter } = require('../../service/isLoginActive');
const { saveCategory } = require('../../utils/saveCategory');
const uploadImgProduct = require('../../middleware/uploadImgProductMiddleware');
const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

let searchWord = '';

// 검색 버튼 클릭시
exports.postSearch = async (req, res) => {
    try {
        const { searchKeyword, searchType } = req.body;
        let result = '';
        if (searchType === 'name') {
            result = await Product.findAll({
                where: {
                    productName: {
                        [Op.like]: `%${searchKeyword}%`,
                    },
                },
                order: [['productId', 'DESC']],
            });
        } else if (searchType === 'seller') {
            result = await Product.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['userId', 'nickname'], // userId, nickname
                        where: {
                            nickname: {
                                [Op.eq]: searchKeyword, // nickname이 일치하는 경우
                            },
                        },
                    },
                ],
                where: {
                    userId: {
                        [Op.ne]: null, // userId가 null이 아닌 경우 (필요에 따라 조정 가능)
                    },
                },
            });
        } else {
            res.send(`${searchType} 은 존재하지 않는 searchType 입니다.`);
        }
        if (result.length) {
            res.send({ result });
        } else {
            res.send({ message: '해당 키워드에 맞는 중고리스트가 존재하지 않습니다.' });
        }
    } catch (err) {
        console.log('error : ', err);
        res.status(500).json({ message: 'postSearch 서버 오류', err: err.message });
    }
};

// 전체 상품 리스트 /product/list?page=1&limit=10
exports.getProductList = async (req, res) => {
    try {
        // 페이지 네이션
        let { page, limit } = req.query; // 요청 페이지 넘버
        const userId = req.userId; //로그인한 유저
        let offset = (page - 1) * limit; // 시작 위치 : 0
        let listCnt = parseInt(offset) + parseInt(limit - 1);

        console.log(`${page}page : ${offset} ~ ${listCnt}`);

        const productCNT = await Product.findAndCountAll({});

        const likesCNT = await Product.findAll({
            attributes: [
                'productId',
                'productName',
                'userId',
                'price',
                'content',
                'categoryId',
                'viewCount',
                'status',
                'buyerId',
                'createdAt',
                'updatedAt',
                [sequelize.fn('COUNT', sequelize.col('Like.likesId')), 'likeCount'], // 좋아요 개수
                [sequelize.fn('COUNT', sequelize.col('Report.reportId')), 'reportCount'], // 신고 개수
            ],
            include: [
                {
                    model: Likes,
                    attributes: [], // 좋아요의 ID는 필요 없으므로 빈 배열
                },
                {
                    model: Report,
                    attributes: [],
                },
                {
                    model: User,
                    attributes: ['nickname'],
                },
                {
                    model: Location,
                    attributes: ['depth1', 'depth2', 'depth3'],
                },
                {
                    model: ProductImage,
                    attributes: ['productImage'],
                    limit: 1,
                },
            ],
            group: ['Product.productId'], // productId로 그룹화
            order: [['productId', 'DESC']],
            raw: true,
            offset,
            limit: parseInt(limit),
        });

        console.log('>>> likesCNT', likesCNT);

        var result = await Product.findAll({
            attributes: ['productId'],
            include: [
                {
                    model: ProductImage,
                    attributes: ['productImage'],
                    limit: 1,
                },
            ],
            order: [['productId', 'DESC']],
        });
        const jsonProducts = result.map((product) => product);
        console.log('result >> ', typeof jsonProducts);
        const updatedProducts = jsonProducts.map((product) => {
            const productId = product.dataValues.productId;
            const profileImgUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/product/${productId}`;
            return product.dataValues.ProductImages.map((image) => ({
                productId: `${productId}`,
                productImage: `${profileImgUrl}/${image.productImage}`,
            }));
        });
        console.log('updatedProducts > ', updatedProducts);

        const productInfo = likesCNT.map((item) => {
            let time = item.updatedAt;

            var year = time.getFullYear();
            var month = ('0' + (1 + time.getMonth())).slice(-2);
            var day = ('0' + time.getDate()).slice(-2);
            time = `${year}-${month}-${day}`;
            time ? { ...item, updatedAt: time } : item;
            // console.log("time >> ", time);
            return time ? { ...item, updatedAt: time, nickname: item['User.nickname'] } : item;
        });

        // 이미지 불러오기
        // const getImages = await uploadImgProduct.getProductImg(req, productId, 'product');
        const totalPages = Math.ceil(productCNT.count / limit);
        const locations = likesCNT.map(product => ({
            depth1: product['Location.depth1'],
            depth2: product['Location.depth2'],
            depth3: product['Location.depth3']
        }));

        res.send({
            totalCount: productCNT.count,
            productInfo : productInfo,
            createdAt: productInfo,
            images: updatedProducts,
            location: locations,
            totalPages: totalPages,
            currentPage: page,
        });
        // res.send({ totalCount: productCNT.count, productInfo: productInfo });
    } catch (err) {
        res.status(500).json({ message: 'getProductList 서버 오류', err: err.message });
    }
};

// 상품 상세 페이지
// GET /product/read?productId=
exports.getProduct = async (req, res) => {
    try {
        const { productId } = req.query;
        console.log(`req.query > `, req.query);

        console.log('1개 상품 보기', productId);

        // 상품 정보 불러오기
        const product = await Product.findOne({
            attributes: [
                'productId',
                'productName',
                'userId',
                'price',
                'content',
                'categoryId',
                'viewCount',
                'status',
                'buyerId',
                'createdAt',
                'updatedAt',
            ],
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                },
                {
                    model: Location,
                    attributes: ['depth1', 'depth2', 'depth3'],
                },
            ],
            where: { productId },
        });

        var checklikes = 0;
        let userId = 0;
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization;
            // console.log('authHeader > ', authHeader);

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
            console.log('userId >> ', userId);
            checklikes = await checkLikes(productId, userId);
        }
        console.log('checklikes > ', checklikes);

        console.log('product.location.depth1 > ', product.Location.dataValues);
        // 찜 개수 불러오기
        const likeCnt = await getLikes(productId);
        console.log('likesCnt >> ', likeCnt);

        // 신고 수 불러오기
        const reportCnt = await getReport(productId);
        console.log('reportCnt >> ', reportCnt);

        // 이미지 불러오기
        const getImages = await uploadImgProduct.getProductImg(req, productId, 'product');
        console.log('getImages >', getImages);

        let time = new Date(String(product.createdAt));
        var year = time.getFullYear();
        var month = ('0' + (1 + time.getMonth())).slice(-2);
        var day = ('0' + time.getDate()).slice(-2);

        time = `${year}-${month}-${day}`;

        console.log('reportCnt >> ', reportCnt);
        console.log(`(userId? userId : 0)`, userId ? userId : 0);

        // 새상품 가격 받아오기
        const query = product.productName.split(' ')[0];
        console.log(query);
        const newItem = await getNproductPrice(query, 'product', req, res);
        // console.log('newItem >', newItem);

        res.send({
            userId: userId ? userId : 0,
            sellerId: product.userId,
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            content: product.content,
            categoryId: product.categoryId,
            viewCount: product.viewCount,
            status: product.status,
            isLike: checklikes,
            totalLikes: likeCnt,
            totalReport: reportCnt,
            createdAt: time,
            images: getImages,
            newItem,
            location: product.Location});
    } catch (err) {
        res.status(500).json({ message: 'getProduct 서버 오류', err: err.message });
    }
};

// 상품 작성 페이지
// GET /product/write
exports.getProductWrite = async (req, res) => {
    try {
        console.log('상품 작성 페이지');

        const result = await isLoginUser(req, res);

        if (result) {
            // res.render('productWrite',{title: "상품 작성 페이지"})
            res.send('상품 작성 페이지');
        }
    } catch (err) {
        res.status(500).json({ message: 'getProductWrite 서버 오류', err: err.message });
    }
};

// 상품 등록 버튼 클릭시
// POST /product/write
exports.postProduct = async (req, res) => {
    try {
        console.log('상품 등록 버튼 클릭');
        const result = await isLoginUser(req, res);
        const userId = req.userId;
        console.log('req.userId  >', userId);

        if (!result) {
            return;
        }
        const { productName, price, content, categoryId } = req.body;

        var imgFileArr = req.files;

        // productId를 받기 위한 조회
        let lastProductId = await Product.findOne({
            order: [['productId', 'DESC']],
            attributes: ['productId'],
        });
        var newProductId = 1;
        if (lastProductId) {
            newProductId = lastProductId ? lastProductId.productId + 1 : 1;
        }
        console.log('newProductId >>>>>> ', newProductId);

        const newSecHandProduct = await Product.create({
            productId: newProductId,
            productName,
            userId,
            price,
            content,
            categoryId,
        });

        // 중고 상품 이미지 저장
        const extractFilenames = [];

        for (const product in imgFileArr) {
            imgFileArr[product].forEach((item) => {
                console.log('>>', item.originalname);
                extractFilenames.push(item.originalname);
            });
        }

        // 추출된 filename들
        console.log('extractFilenames > ', extractFilenames);

        for (i = 0; i < extractFilenames.length; i++) {
            console.log('i >> ', i);

            const newImage = await ProductImage.findOrCreate({
                where: { productId: newProductId, productImage: extractFilenames[i] },
                defaults: {
                    productId: newProductId,
                    productImage: extractFilenames[i],
                },
            });
        }
        console.log('saved');

        res.json(newSecHandProduct);
    } catch (err) {
        res.status(500).json({ message: 'postProduct 서버 오류', err: err.message });
    }
};

// 상품 수정 페이지
// GET /product/update?productId=
exports.getProductUpdate = async (req, res) => {
    try {
        console.log('상품 수정 페이지.');
        const { productId } = req.query;
        const result = await isLoginUser(req, res);
        console.log('result > ', result);

        if (!result) return;

        const writer = await isWriter(req, productId);
        console.log('writer>> ', writer);

        if (!writer) {
            res.status(400).json({ message: '로그인 유저와 작성자가 일치하지 않습니다.' });
        } else {
            const secHandProduct = await Product.findOne({ where: { productId } });
            res.send({ data: secHandProduct });
        }
    } catch (err) {
        res.status(500).json({ message: 'getProductUpdate 서버 오류', err: err.message });
    }
};

// 상품 수정 버튼 클릭시
// POST /product/update?productId=
exports.postProductUpdate = async (req, res) => {
    try {
        console.log('상품 수정 버튼 클릭됨.');
        console.log('req.body > ', req.body);
        const { productId } = req.query;
        const { productName, price, content, categoryId, status } = req.body;

        const result = await isLoginUser(req, res);

        if (!result) return;

        const writer = await isWriter(req, productId);
        console.log('writer>> ', writer);

        if (!writer) {
            res.status(400).json({ message: '로그인 유저와 작성자가 일치하지 않습니다.' });
        } else {
            const secHandProduct = await Product.update(
                {
                    productName,
                    price,
                    content,
                    categoryId,
                    status,
                },
                {
                    where: { productId },
                }
            );
            var imgFileArr = req.files;
            // 상품 이미지 s3에 삭제
            const findImg = await uploadImgProduct.deleteProductImg(req, productId, 'product');
            console.log('findImg > ', findImg);
            // 상품 이미지 s3 추가
            // const addImg = await uploadImgProduct.postUpProductImage();
            // console.log('addImg > ', addImg);

            const extractFilenames = [];
            for (const product in imgFileArr) {
                imgFileArr[product].forEach((item) => {
                    console.log('>>', item.originalname);
                    extractFilenames.push(item.originalname);
                });
            }

            // 추출된 filename들
            console.log('extractFilenames > ', extractFilenames);

            const existingRecord = await ProductImage.destroy({
                where: { productId },
            });

            for (i = 0; i < extractFilenames.length; i++) {
                console.log('i >> ', i);
                console.log('existingRecord > ', existingRecord);

                const newImage = await ProductImage.create({
                    productId: productId,
                    productImage: extractFilenames[i],
                });
                console.log('기존에 값이 없으므로 추가합니다. ');
            }
            res.send('업데이트 완료');
        }

        // 상품 db 저장
    } catch (err) {
        res.status(500).json({ message: 'getProductUpdate 서버 오류', err: err.message });
    }
};

// 상품 삭제 페이지 /product/delete?productId=""
exports.deleteProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.query);
        const { productId } = req.query;
        const result = await isLoginUser(req, res);

        if (!result) return;

        const writer = await isWriter(req, productId);
        console.log('writer>> ', writer);
        if (!writer) {
            res.status(400).json({ message: '로그인 유저와 작성자가 일치하지 않습니다.' });
        } else {
            const findImg = await uploadImgProduct.deleteProductImg(req, productId, 'product');
            console.log('findImg > ', findImg);

            const isDeleted = await Product.destroy({
                where: { productId },
            });
            console.log('상품 정보 삭제완료 >> ', isDeleted);

            res.send('삭제 성공!');
        }
    } catch (err) {
        res.status(500).json({ message: 'deleteProduct 서버 오류', err: err.message });
    }
};

// 안전거래 버튼 클릭시
exports.getOrder = async (req, res) => {
    try {
        console.log('안전 거래 버튼 클릭', req.query);
        const { productId } = req.query;
        const result = await isLoginUser(req, res);

        if (!result) return;

        const writer = await isWriter(req, productId);
        console.log('writer>> ', writer);

        if (writer) {
            res.status(400).json({ message: '본인은 본인 물건을 살 수 없다!' });
        } else {
            // res.render('productWrite',{title: "결제창 페이지"})
            res.send('결제 페이지로 이동합니다...');
        }
    } catch (err) {
        res.status(500).json({ message: 'getOrder 서버 오류', err: err.message });
    }
};

// 카테고리
exports.postCategory = async (req, res) => {
    try {
        // 카테고리 목록 저장
        const result = await Category.findAndCountAll({
            where: { level: 3 },
        });
        console.log('result :', result.count);

        if (result.count < 1900) {
            console.log('소분류 카테고리 1900개 이하이므로 저장합니다. ');
            await Category.destroy({
                where: {
                    categoryId: { [Op.gte]: 1 },
                },
            });
            await saveCategory(req, res); //11 //231 //1912
        }

        res.send(result);
    } catch (err) {
        res.status(500).json({ message: 'postCategory 서버 오류', err: err.message });
    }
};
