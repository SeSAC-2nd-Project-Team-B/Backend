const { Product, Likes } = require('../models/Index');
const { isLoginUser, isWriter } = require('../service/isLoginActive');
var sequelize = require('sequelize');

exports.getLikes = async (req) => {
    try {
        const productId = req;
        console.log('productId > ', productId);
        const likes = await Likes.findOne({
            where: {
                productId,
            },
            attributes: [[sequelize.fn('SUM', sequelize.col('likesCount')), 'totalLike']],
            raw: true,
        });

        var likeCnt = likes.totalLike ? likes.totalLike : 0;
        console.log('likeCnt > ', likeCnt);
        return likeCnt;
    } catch (err) {
        return `message: 'getLikes 서버 오류', err: ${err.message} `;
    }
};

exports.postLikes = async (req, res) => {
    const { productId } = req.query;
    try {
        console.log('req.query > ', req.query);
        const userId = req.userId;
        const result = await isLoginUser(req, res);
        console.log('userId > ', userId)
        if (!result) return;
        
        const writer = await isWriter(req, productId);
        console.log("writer>> ",writer)
        
        if(writer){
            res.send({"message": "본인은 본인글에 찜을 누를 수 없다."})
        }else{

        const userLikes = await Likes.findOne({
            where: {
                productId,
                userId,
            },
            attributes: ['likesCount'],
            raw: true,
        });
        console.log('b4 likesInfo >> ', userLikes);
        if (userLikes) {
            console.log('product, user 가 likes table 에 존재함.');

            const isAlreadyLike = await Likes.findOne({
                where: {
                    productId,
                    userId,
                },
                attributes: ['likesCount'],
                raw: true,
            });

            console.log('isAlreadyLike > ', isAlreadyLike);
            if (isAlreadyLike.likesCount === 1) {
                // 유저 좋아요 1일 경우
                console.log(`유저 좋아요가 1이므로 0으로 바뀜`);
                await Likes.destroy({
                    where: { productId, userId },
                });
            } else {
                // 유저 좋아요 0일 경우
                console.log(`유저 좋아요가 0이므로 1으로 바뀜`);
                await likesCreate(productId, userId, 1);
            }
        } else {
            const isUser = await Likes.findOne({
                where: {
                    productId,
                    userId,
                },
                attributes: ['userId'],
                raw: true,
            });
            if (!isUser) {
                console.log(`${userId}의 찜 내역은 없으므로 새로 생성한다.`);
                await likesCreate(productId, userId, 1);
            }
        } 
        res.send(`${userId}번 유저가 ${productId}번 상품에 
                좋아요를 눌렀습니다.`);
            }
    } catch (err) {
        res.status(500).json({ message: 'postLikes 서버 오류', err: err.message });
    }
};

exports.checkLikes = async (productId, userId) => {
    try {
        // console.log("checkLikes req >> ", );
        
        // const { productId, userId } = req;
        console.log('checkLikes parameter > ', productId,userId);
        const likes = await Likes.findOne({
            where: {
                productId,
                userId
            },
            
            raw: true,
        });
        var islike = likes.likesCount ? likes.likesCount : 0;
        console.log('do i likes ? ',islike)
        return islike;
    } catch (err) {
        return `message: 'checkLikes 서버 오류', err: ${err.message} `;
    }
};

function likesCreate(productId, userId, likesCount) {
    Likes.create(
        { productId, userId, likesCount },
    );
}
