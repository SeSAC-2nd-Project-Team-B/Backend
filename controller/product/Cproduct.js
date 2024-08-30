const { Product, ProductImage, Category, NewProduct, Review, Likes, Report } = require('../../models/Index');

// 전체 상품 리스트 /product/list
exports.getProductList = async (req, res) => {
    try {
        const product = await Product.findAll({
            order : [['productId','DESC']],
            raw : true,
            limit: 10,
            offset: (page - 1) * 10,
        });
        res.json(product);
        console.log('전체 상품 리스트');
    } catch (err) {
        res.status(500).json({ message: 'getProductList 서버 오류', err: err.message });
    }
};

// 상품 상세 페이지
// GET /product/read?productid=""
exports.getProduct = async (req, res) => {
    try {
        console.log('req.query > ', req.query);
        const { productId, userId } = req.query;
        console.log('1개 상품 보기', productId);
        const product = await Product.findOne({
            where: { productId },
        });
        const likes = await Likes.findOne({
            where: { 
                productId,
                userId 
            },
        });
        const likesCount = likes.likesCount; //좋아요 개수
        res.json(likesCount);
    } catch (err) {
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
        const lastProductId = await Product.findOne({
            order: [['createdAt', 'DESC']],
            attributes: ['productId'],
        });
        console.log('lastProId >>>>>> ', lastProductId.productId + 1);

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
            where: { productId }
        });
        console.log("삭제완료 >> ",isDeleted);
        if(isDeleted === 1){
            res.send('삭제 성공 !🌟')
        }else{
            res.send('띠용!')
        }
        
    } catch (err) {
        res.status(500).json({ message: 'deleteProduct 서버 오류', err: err.message });
    }
};
