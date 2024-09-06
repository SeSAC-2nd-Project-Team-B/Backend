const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../config/s3config");

exports.upload = multer({
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("허용되지 않는 파일 형식입니다. png, jpeg, jpg 만 업로드 가능합니다."), false);
        }
    },
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const type = req.params.type;
            const userId = req.params.userId;
            console.log("🚀 ~ type:", type)
            console.log("🚀 ~ userId:", userId)

            if (type === 'user') {
                cb(null, `${type}/${userId}/${Date.now()}_${file.originalname}`);
            } else {
                cb(new Error('유효하지 않은 type 입니다.'));
            }
        }
    })
});