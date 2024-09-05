const { uploadImgToS3, getImgFromS3, deleteImgFromS3 } = require("../../service/uploadImgService");
const { User } = require("../../models/Index");
const { upload } = require("../../middleware/uploadImgMiddleware")
const { getImgUrl } = require("../../service/uploadImgService");
const { s3 } = require("../../config/s3config");
const uploadImgService = require("../../service/uploadImgService");


// 유저 프로필 이미지 등록/수정
exports.postImg = async (req, res) => {
    const type = req.params.type;
    console.log("🚀 ~ exports.postImg= ~ type:", type)
    const userId = req.params.userId;
    const file = req.file;
    console.log("🚀 ~ exports.s3ImgTest= ~ file:", file)
    
    try {
        
        if (type === 'user') {

            const result = await uploadImgService.postUserProfileImg(userId, file, type);

            return res.status(200).json(result);

        } else {
            return res.status(400).json({ errorMessage: '유효하지 않은 type 입니다.' });
        }
            
    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


// 유저 프로필 이미지 조회
exports.getImg = async (req, res) => {
    const type = req.params.type;
    const userId = req.params.userId;
    
    try {
        if (type === 'user') {

            const result = await uploadImgService.getUserProfileImg(userId, type);

            return res.status(200).json(result);

        } else {
            return res.status(400).json({ errorMessage: '유효하지 않은 type 입니다.' });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 유저 프로필 이미지 삭제
exports.deleteImg = async (req, res) => {
    const type = req.params.type;
    const userId = req.params.userId;
    
    try {
        if (type === 'user') {

            const result = await uploadImgService.deleteUserProfileImg(userId, type);

            return res.status(200).json(result);

        } else {
            return res.status(400).json({ errorMessage: '유효하지 않은 type 입니다.' });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






// S3 EJS 테스트
exports.s3ImgPostTest = async (req, res) => {
    const type = req.params.type;
    const userId = req.params.userId;
    const file = req.file;
    console.log("🚀 ~ exports.s3ImgTest= ~ file:", file)
    
    try {
        if (!type) {
            return res.status(404).render('index', { 
                errorMessage: 'type을 선택해주세요. user or product', 
                profileImgUrl: '', 
                filePath: '', 
                userId, 
                type 
            });
        }

        const user = await User.findOne({ where: { userId } });
        
        if (!user) {
            return res.status(404).render('index', { 
                errorMessage: '유저를 찾을 수 없습니다.', 
                profileImgUrl: '', 
                filePath: '', 
                userId, 
                type 
            });
        }

        // 기존 파일이 있으면 S3에서 삭제
        if (user.profileImage) {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: user.profileImage
            };

            try {
                await s3.deleteObject(params).promise();
                console.log("기존 파일 삭제되었습니다.", user.profileImage);
            } catch (error) {
                console.error("S3 파일 삭제 중 오류가 발생했습니다.", error.message);
            }
        }

        try {
            // DB에 파일 이름 저장
            await User.update(
                { profileImage: file.key },
                { where: { userId } }
            );
            
            console.log("🚀 ~ exports.s3ImgPostTest= ~ userId:", userId)
            console.log("🚀 ~ exports.s3ImgPostTest= ~ file.key:", file.key)
            console.log("🚀 ~ exports.s3ImgPostTest= ~ file.location:", file.location)

            // return res.status(200).json({ url: file.location });

            return res.render('index', { 
                profileImgUrl: file.location,
                filePath: file.key,
                userId,
                type,
                errorMessage: null
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
            
    } catch (error) {
        return res.render('index', { userId, type, profileImgUrl: null, errorMessage: error.message });
    }
};
