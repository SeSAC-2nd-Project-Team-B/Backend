const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Product, ProductImage, Category, NewProduct, Review, Likes, Report } = require('../../models/Index');

const { getNproductPrice } = require('../../utils/apiHandler');
const { getLikes, postLikes } = require('../../service/likesService');
const { getReport , postReportProduct} = require('../../service/reportService');

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

let searchWord ='';

// 검색 버튼 클릭시
exports.postSearch = async (req, res) => {
    try {
        console.log('searchKeyword: ', req.body);
        const { searchKeyword } = req.body;
        searchWord = searchKeyword;
        const url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURIComponent(searchKeyword);
        const ClientID = process.env.NAVER_CLIENT_ID;
        const ClientSecret = process.env.NAVER_CLIENT_SECRET;

        const result = await Product.findAll({
            where: {
                productName: {
                    [Op.like]: `%${searchKeyword}%`,
                },
            },
            order: [['productId', 'DESC']],
        });

        // 네이버에서 새상품 가격 받아오기
        console.log("searchWord > ", searchWord);
        
        const newData = await getNproductPrice(searchWord);
        console.log("newData > ",newData);
        
        if (result.length) {
                res.send ({
                    result: result,
                    newData
                });
        
        } else {
            res.send({ message: '해당 키워드에 맞는 중고리스트가 존재하지 않습니다.' });
        }
    } catch (err) {
        console.log('error : ',err)
        // res.status(500).json({ message: 'postSearch 서버 오류', err: err.message });
    }
};

// 전체 상품 리스트 /product/list
exports.getProductList = async (req, res) => {
    try {
        const product = await Product.findAll({
            order: [['productId', 'DESC']],
            raw: true,
        });
        const likesCnt = await Likes.findAll({

            attributes: ['productId', [sequelize.fn('SUM', sequelize.col('likesCount')), 'totalLike']],
            group: ['productId'],
            raw: true,
        });
        console.log(likesCnt);
        
        res.send({
            product,
            likesCnt : likesCnt
        })
    } catch (err) {
        res.status(500).json({ message: 'getProductList 서버 오류', err: err.message });
    }
};

// 상품 상세 페이지
// GET /product/read?productId=""
exports.getProduct = async (req, res) => {
    try { 
        console.log('req.query > ', req.query);
        //userId : req.session.id 
        const { productId, userId } = req.query;
        console.log('1개 상품 보기', productId);
        // 상품 정보 불러오기
        const product = await Product.findOne({
            where: { productId },
        });
        // 찜 개수 불러오기
        const likeCnt = await getLikes(productId);
        
        // 신고 수 불러오기 
        // const reportCnt = await getReport(productId,userId);

        console.log("likes >> ", likeCnt);
        if (likeCnt) {
            res.send({
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                content: product.content,
                viewCount: product.viewCount,
                status: product.status,
                totalLikes: likeCnt
            })
        } else {
            res.send('해당 상품은 좋아요 개수가 조회되지 않습니다.');
        }
    } catch (err) {
        // res.send('getProduct error')
        res.status(500).json({ message: 'getProduct 서버 오류', err: err.message });
    }
};

// 상품 작성 페이지 /write
// GET /product/write
exports.getProductWrite = async (req, res) => {
    try {
        console.log('상품 작성 페이지');
        // res.render('productWrite',{title: "상품 작성 페이지"})
        res.send('상품 작성 페이지');
    } catch (err) {
        res.status(500).json({ message: 'getProductWrite 서버 오류', err: err.message });
    }
};

// 상품 등록 버튼 클릭시
// POST /product/write
exports.postProduct = async (req, res) => {
    try {
        console.log('상품 등록 버튼 클릭');
        const {
            productName,
            userId,
            price,
            content,
            categoryName1,
            categoryName2,
            categoryName3,
            category1,
            category2,
            category3,
        } = req.body;

        // productId를 받기 위한 조회
        // const lastProductId = await Product.findOne({
        //     order: [['createdAt', 'DESC']],
        //     attributes: ['productId'],
        // });
        // console.log('lastProId >>>>>> ', lastProductId.productId + 1);

        const newSecHandProduct = await Product.create({
            productName,
            userId,
            price,
            content,
        });

        // 카테고리 추가
        // for (i = 1; i < 4; i++) {
        //     console.log(
        //         'categoryName > ',
        //         `${categoryName} + ${i}`,
        //         lastProductId.productId + 1,
        //         'parentCategoryId > ',
        //         i - 1,
        //         'level > ',
        //         i
        //     );
        //     const productCategory = await Category.create({
        //         categoryName: `${categoryName}${i}`,
        //         productId: lastProductId.productId + 1,
        //         parentCategoryId: i - 1, // 수정필요
        //         level: i,
        //     });
        // }

        res.json(newSecHandProduct);
    } catch (err) {
        res.status(500).json({ message: 'postProduct 서버 오류', err: err.message });
    }
};

// 상품 수정 페이지
// POST /product/update?productId=
exports.getProductUpdate = async (req, res) => {
    try {
        console.log('상품 수정 버튼 클릭됨.');
        console.log('req.query > ', req.query);
        const { productId } = req.query;
        // 상품 db 저장
        const secHandProduct = await Product.findOne({
            where: { productId },
        });

        res.json(secHandProduct);
    } catch (err) {
        res.status(500).json({ message: 'getProductUpdate 서버 오류', err: err.message });
    }
};

// 상품 수정 버튼 클릭시
// POST /product/update?productId=
exports.patchProductUpdate = async (req, res) => {
    try {
        console.log('상품 수정 버튼 클릭됨.');
        console.log('req.body > ', req.body);
        const { productId } = req.query;
        const { productName, price, content, status } = req.body;
        // 상품 db 저장
        const secHandProduct = await Product.update(
            {
                productName,
                price,
                content,
                status,
            },
            {
                where: { productId },
            }
        );
        var imgFileArr = req.files;
        console.log('req.files >> ', req.files);
        // filename 속성을 추출하는 함수
        const extractFilenames = (imgArr) => {
            const filenames = [];
            for (const key in imgArr) {
                if (Object.prototype.hasOwnProperty.call(imgArr, key)) {
                    imgArr[key].forEach((file) => {
                        filenames.push(file.filename);
                    });
                }
            }
            return filenames;
        };
        // 추출된 filename들
        const filenames = extractFilenames(imgFileArr);
        console.log('filenames >>> ', filenames);
        for (i = 0; i < filenames.length; i++) {
            let main_img = i + 1;
            const existingRecord = await Recipe_Img.findOne({
                where: { recipe_num, main_img },
            });
            console.log('existingRecord > ', existingRecord);
            //이미지 찾기
            if (existingRecord) {
                console.log('i >> ', i, filenames[i]);
                const newImage = await Recipe_Img.update(
                    {
                        image_url: filenames[i],
                    },
                    {
                        where: { recipe_num, main_img },
                    }
                );
            } else {
                const newImage = await Recipe_Img.create({
                    recipe_num: recipe_num,
                    image_url: filenames[i],
                    main_img: i + 1,
                });
                console.log('기존에 값이 없으므로 추가햇음 > ', main_img, i);
            }
        }
        res.send('업데이트 완료');
    } catch (err) {
        res.status(500).json({ message: 'getProductUpdate 서버 오류', err: err.message });
    }
};

// 상품 삭제 페이지 /delete?productId=""
exports.deleteProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.query);
        const { productId } = req.query;
        const isDeleted = await Product.destroy({
            where: { productId },
        });
        console.log('삭제완료 >> ', isDeleted);
        if (isDeleted === 1) {
            res.send('삭제 성공 !🌟');
        } else {
            res.send('띠용!');
        }
    } catch (err) {
        res.status(500).json({ message: 'deleteProduct 서버 오류', err: err.message });
    }
};


// 마이페이지 - 구매 리스트
exports.getBuyList = async (req,res) => {
    try {
        
    } catch (err) {
        res.status(500).json({ message: 'getBuyList 서버 오류', err: err.message });
    }
}