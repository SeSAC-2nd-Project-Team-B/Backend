const { s3 } = require("../config/s3config");
const { User } = require("../models/Index");


exports.postUserProfileImg = async (userId, file, type) => {
    const user = await User.findOne({ where: { userId } });
    
    if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
    }

    // 기존 파일이 있으면 S3에서 삭제
    if (user.profileImage) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: user.profileImage
        };

        try {
            console.log("기존 파일 삭제 시도 중:", user.profileImage);
            await s3.deleteObject(params).promise();
            console.log("기존 파일 삭제되었습니다.", user.profileImage);
        } catch (error) {
            console.error("S3 파일 삭제 중 오류가 발생했습니다.", error.message);
        }
    }

    try {
        await User.update(
            { profileImage: file.key },
            { where: { userId } }
        );

        console.log("🚀 ~ exports.s3ImgPostTest= ~ userId:", userId);
        console.log("🚀 ~ exports.s3ImgPostTest= ~ file.key:", file.key);
        console.log("🚀 ~ exports.s3ImgPostTest= ~ file.location:", file.location);

        return { 
            profileImgUrl: file.location,
            filePath: file.key,
            userId,
            type,
            errorMessage: null
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.getUserProfileImg = async (userId, type) => {
    const user = await User.findOne({ where: { userId } });
    
    if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
    }

    try {
        const filePath = user.profileImage;
        if (!filePath) {
            return {
                profileImgUrl: null,
                filePath: null,
                userId,
                type,
                errorMessage: '프로필 이미지가 없습니다.'
            };
        }

        const profileImgUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;

        return { 
            profileImgUrl,
            filePath,
            userId,
            type,
            errorMessage: null
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.updateUserProfileImg = async (userId, file, type) => {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
    }

    if (user.profileImage) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: user.profileImage
        };

        try {
            console.log("기존 파일 삭제 시도 중:", user.profileImage);
            await s3.deleteObject(params).promise();
            console.log("기존 파일 삭제되었습니다.", user.profileImage);
        } catch (error) {
            console.error("S3 파일 삭제 중 오류가 발생했습니다.", error.message);
        }
    }

    try {
        await User.update(
            { profileImage: file.key }, 
            { where: { userId } }
        );

        console.log("🚀 ~ exports.updateUserProfileImg= ~ userId:", userId);
        console.log("🚀 ~ exports.updateUserProfileImg= ~ file.key:", file.key);
        console.log("🚀 ~ exports.updateUserProfileImg= ~ file.location:", file.location);

        return {
            profileImgUrl: file.location,
            filePath: file.key,
            userId,
            type,
            errorMessage: null
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.deleteUserProfileImg = async (userId, type) => {
    const user = await User.findOne({ where: { userId } });
    
    if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
    }

    const filePath = user.profileImage;
    if (!filePath) {
        return {
            profileImgUrl: null,
            filePath: null,
            userId,
            type,
            errorMessage: '프로필 이미지가 없습니다.'
        };
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filePath
    };

    try {
        console.log("S3에서 파일 삭제 시도 중입니다.", filePath);
        await s3.deleteObject(params).promise();
        console.log("S3에서 파일 삭제 성공하였습니다.", filePath);

        await User.update(
            { profileImage: null },
            { where: { userId } }
        );
        console.log("DB에서 파일 경로 삭제 성공하였습니다.", userId);

        return {
            profileImgUrl: null,
            filePath: null,
            userId,
            type,
            errorMessage: '프로필 이미지가 삭제되었습니다.'
        };

    } catch (error) {
        console.error('S3 파일 삭제 또는 DB 업데이트 중 오류 발생가 발생했습니다.', error.message);
        throw new Error(error.message);
    }
};
