const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/s3config');
const { Product, ProductImage } = require('../models/Index')

exports.postUpProductImage = (type) => multer({
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
                console.log(">>> multer middleware 들어옴 >>> type : ", typeof type)
        
                let lastProductId = await Product.findOne({
                    order: [['createdAt', 'DESC']],
                    attributes: ['productId'],
                });
                
                let pId;
                if (type === 'update') {
                    if (!lastProductId) {
                        cb(new Error('업데이트할 상품이 존재하지 않습니다.'));
                        return;
                    }
                    pId = lastProductId.productId;
                } else if (type === 'create') {
                    pId = lastProductId ? lastProductId.productId + 1 : 1;
                } else {
                    cb(new Error('유효하지 않은 type 입니다.'));
                    return;
                }
        
                console.log('🚀 ~ productId:', pId);
                const filename = `product/${pId}/${file.originalname}`;
                console.log("filename >> ", filename);
                
                cb(null, filename);
            } catch (error) {
                console.log("postUpProductImage error : ", error);
                cb(error);
            }
        },
        
    }),

    limits: { fileSize: 100 * 1024 * 1024 }, //업로드 크기 제한
}).fields([
    { name: 'productImg', maxCount: 10 }
]);



exports.getProductImg = async (req, productId, type) => {
    const image = await ProductImage.findAll({ where: { productId } });
    console.log("productId > ", productId);

    try {
        const profileImgUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${type}/${productId}/`;
        const imageFiles = image.map(productImage => profileImgUrl + productImage.dataValues.productImage);
        console.log('filePath > ', imageFiles);
        if (!imageFiles) {
            return {
                profileImgUrl: null,
                productId,
                type,
                errorMessage: '상품 이미지가 없습니다.',
            };
        }

        return imageFiles;
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.deleteProductImg = async function (req, productId, type) {
    const image = await ProductImage.findAll({ where: { productId } });
    console.log("deleteProductImg 개수 >> ", image.length);

    try {
        // if (image.length == 0) {
        //     return {
        //         profileImgUrl: null,
        //         filePath: null,
        //         productId,
        //         type,
        //         errorMessage: '상품 이미지가 없습니다.',
        //     };
        // }
        const imageFiles = image.map(a => a.dataValues.productImage);
        console.log("deleteProductImg Files >>> ", imageFiles);
        
        for (i = 0; i < imageFiles.length; i++) {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `product/${productId}/` + imageFiles[i]
            };

            try {
                console.log("S3에서 파일 삭제 시도 중입니다.", params.Key);
                await s3.deleteObject(params).promise();
                console.log("S3에서 파일 삭제 성공하였습니다.", params.Key);

            } catch (error) {
                console.error('S3 파일 삭제 또는 DB 업데이트 중 오류 발생가 발생했습니다.', error.message);
                throw new Error(error.message);
            }
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};
