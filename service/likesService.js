const { Product, Likes } = require('../models/Index');
var sequelize = require('sequelize');

exports.getLikes = async (req, res) => {
    try {
        const { productId } = req.query;
        const likes = await Likes.findOne({
            where: {
                productId,
            },
            attributes: [[sequelize.fn('COUNT', sequelize.col('likesCount')), 'totalLike']],
        });
        if (likes === null) {
            res.send('해당 상품은 좋아요 개수가 조회되지 않습니다.');
        } else {
            res.send('total Like Count >> ', likes);
        }
    } catch (err) {
        res.status(500).json({ message: 'getLikes 서버 오류', err: err.message });
    }
};

exports.postLikes = async (req, res) => {
    try {
        console.log('req.query > ', req.query);
        const { productId, userId } = req.query;
        const likes = await Likes.findOne({
            where: {
                productId,
                userId,
            },
            attributes: ['userId','likesCount'],
        });
        // const likes = await Likes.findByPk(productId);
        var likesCount=1;
        var uplikesCount;

        // console.log('likes >> ', likes);
        console.log('b4 likesCount >> ', likesCount);
        likesCount === 1 ? likesCount = 0  : likesCount = 1;
        likes
        ? (uplikesCount = await Likes.update(
            { likesCount },
            {
                where: {
                    productId,
                    userId,
                },
            }
        ))
        //     : (await Likes.create({
            //         productId,
            //         userId,
            //         likesCount: 1
            // }));
            : console.log("유저정보없으므로 새로 만든다.");
        likesCount === 1 ? likesCount = 1  : likesCount = 0;
        

        console.log('likesCount >> ', likesCount);

        res.send(`${userId}번 유저가 ${productId} 상품에 
            좋아요를 눌렀습니다. result > > ${likesCount}`);
    } catch (err) {
        res.status(500).json({ message: 'postLikes 서버 오류', err: err.message });
    }
};
