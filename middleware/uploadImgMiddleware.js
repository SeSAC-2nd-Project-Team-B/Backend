const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/s3config');
const { Product } = require('../models/Index')

exports.upload = multer({
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('허용되지 않는 파일 형식입니다. png, jpeg, jpg 만 업로드 가능합니다.'), false);
        }
    },
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const type = req.params.type;
            const userId = req.params.userId;
            console.log('🚀 ~ type:', type);
            console.log('🚀 ~ userId:', userId);

            if (type === 'user') {
                cb(null, `${type}/${userId}/${Date.now()}_${file.originalname}`);
            } else {
                cb(new Error('유효하지 않은 type 입니다.'));
            }
        },
    }),
});

exports.postUploadFile = multer({
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('허용되지 않는 파일 형식입니다. png, jpeg, jpg 만 업로드 가능합니다.'), false);
        }
    },

    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: async (req, file, cb) => {
            try {
                let lastProductId = await Product.findOne({
                    order: [['createdAt', 'DESC']],
                    attributes: ['productId'],
                });
                console.log("lastProductId >", lastProductId.productId);
                
                const newProductId = lastProductId.productId ? Product.productId + 1 : 'error';
                const type = 'product';
                console.log('🚀 ~ type:', type);
                console.log('🚀 ~ productId:', newProductId);

                if (type === 'product') {
                    cb(null, `${type}/${newProductId}/${Date.now()}_${file.originalname}`);
                } else {
                    cb(new Error('유효하지 않은 type 입니다.'));
                }
            } catch (error) {}
        },
    }),

    limits: { fileSize: 100 * 1024 * 1024 }, //업로드 크기 제한
}).fields([
    { name: 'productImg1', maxCount: 1 },
    { name: 'productImg2', maxCount: 1 },
    { name: 'productImg3', maxCount: 1 },
    { name: 'productImg4', maxCount: 1 },
    { name: 'productImg5', maxCount: 1 },
    { name: 'productImg6', maxCount: 1 },
    { name: 'productImg7', maxCount: 1 },
    { name: 'productImg8', maxCount: 1 },
    { name: 'productImg9', maxCount: 1 },
    { name: 'productImg10', maxCount: 1 },
]);

exports.getProductImg = async (req, productId, type) => {
    const image = await ProductImage.findAll({ where: { productId } });

    try {
        const filePath = image.ProductImage;
        console.log('filePath > ', filePath);

        if (!filePath) {
            return {
                profileImgUrl: null,
                filePath: null,
                productId,
                type,
                errorMessage: '상품 이미지가 없습니다.',
            };
        }

        const profileImgUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${type}/${productId}/${filePath}`;

        return {
            profileImgUrl,
            filePath,
            productId,
            type,
            errorMessage: null,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
