const { Product, Likes } = require('../models/Index');
var sequelize = require('sequelize');

exports.getLikes = async (req, res) => {
    try {
        const { productId } = req.query;
        const likes = await Likes.findOne({
            where: {
                productId,
            },
            attributes: [[sequelize.fn('SUM', sequelize.col('likesCount')), 'totalLike']],
            raw: true
        });
        console.log("likes >> ", typeof likes.totalLike);
        if (likes.totalLike) {
            res.status(400).json({"totalLike" : likes.totalLike});
        } else {
            res.send('해당 상품은 좋아요 개수가 조회되지 않습니다.');
        }
    } catch (err) {
        res.status(500).json({ message: 'getLikes 서버 오류', err: err.message });
    }
};

exports.postLikes = async (req, res) => {
    console.log("postlikes >>> --------------");

    try {
        console.log('req.query > ', req.query);
        const { productId, userId } = req.query;
        const userlikes = await Likes.findOne({
            where: {
                productId,
                userId,
            },
            attributes: ['likesCount'],
            raw: true
        });
        console.log('b4 likesCount >> ', userlikes);
        if (userlikes) {
            console.log('product, user 가 table 에 존재함.')

            const isAlreadyLike = await Likes.findOne({
                where: {
                    productId,
                    userId,
                },
                attributes: ['likesCount'],
                raw: true
            });

            console.log("isAlreadyLike > ", isAlreadyLike);
            if (isAlreadyLike.likesCount === 1) { // 유저 좋아요 1일 경우
                console.log(`유저 좋아요가 1이므로 0으로 바뀜`);
                await likesUpdate(productId, userId, 0);
            } else { // 유저 좋아요 0일 경우
                console.log(`유저 좋아요가 0이므로 1으로 바뀜`);
                await likesUpdate(productId, userId, 1);
            }
        } else {
            const isUser = await Likes.findOne({
                where: {
                    productId,
                    userId,
                },
                attributes: ['userId'],
                raw: true
            });
            if (!isUser) {
                console.log(`product 에 대한 좋아요는 있지만,
                    ${userId}의 값은 없으므로 새로 생성한다.`);
                likesCreate(productId, userId, 1);

            } else {
                console.log("???product,userId 다 존재");

            }
        }  // else
        res.send(`${userId}번 유저가 ${productId}번 상품에 
                좋아요를 눌렀습니다.`);
    } catch (err) {
        res.status(500).json({ message: 'postLikes 서버 오류', err: err.message });
    }
};


function likesUpdate(productId, userId, likesCount) {
    Likes.update(
        { likesCount },
        {
            where: {
                productId,
                userId,
            },
        })
}

function likesCreate(productId, userId, likesCount) {
    Likes.create(
        { productId, userId, likesCount },
        {
            where: {
                productId,
                userId,
            },
        })
}