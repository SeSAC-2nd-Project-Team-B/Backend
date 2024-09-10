const { Sequelize, sequelize, DataTypes, Op } = require('sequelize');
const { User, Product, ProductImage, Likes, Report } = require('../../models/Index');
const { getLikes, postLikes } = require('../../service/likesService');
const { getReport, postReportProduct } = require('../../service/reportService');
const { isLoginUser, isWriter } = require('../../service/isLoginActive');

// 구매 및 판매 및 찜 내역
exports.buySellLikesList = async (req, res) => {
    try {
        // const userId = req.session.userId;
        const userId = req.userId;
        console.log('req > ', req.userId);

        var { mypageList } = req.body;
        var findCol =
            mypageList === 'buy' ? 'buyerId' : mypageList === 'sell' || mypageList === 'likes' ? 'userId' : 'nono';

        console.log('mypageList > ', mypageList, findCol);
        if (findCol == 'nono') res.send('잘못된 인자값');
        if (mypageList === 'buy' || mypageList === 'sell') {
            const type='product';

            var result = await Product.findAll({
                where: {
                    [findCol]: userId,
                },
                include:[
                    {
                        model : ProductImage, 
                        attributes: ['productImage'],
                        limit:1,
                    }
                ],
                order: [['productId', 'DESC']],
            });

            
            
            const jsonProducts = result.map(product => product.toJSON());
            const jsonData = JSON.stringify(jsonProducts, null, 2)
            console.log("result >> ", typeof jsonProducts)
            const updatedProducts = jsonProducts.map(product => {
                // console.log("product >> ",product);
                
                const profileImgUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/product/${product.productId}`;
                return {
                    ...product, // 기존의 속성들을 유지
                    ProductImages: product.ProductImages.map(image => ({
                        productImage: `${profileImgUrl}/${image.productImage}` // 새로운 형식으로 변경
                    }))
                };
            });
            console.log("updatedProducts > ", updatedProducts);
            // return ;
            
            if (result.length === 0) {
                const text = mypageList === 'buy' ? '구매내역이 존재하지 않습니다.':
                '판매내역이 존재하지 않습니다.'
                res.send(text);
            } else {
                res.send(updatedProducts);
            }

            console.log(`${mypageList} count  >> `, result.length);
        } else if (mypageList === 'likes') {
            ///
            const productsWithImage = await Product.findAll({
                include: [
                    {
                        model: ProductImage,
                        attributes: ['productImage'],
                        limit: 1, // 각 Product에 대해 첫 번째 ProductImage만 가져옴
                    },
                    {
                        model: Likes,
                        attributes: [], // Likes 테이블에서 특정 속성을 가져오지 않음
                        where: {
                            productId: {
                                [Op.ne]: null, // null이 아닌 productId만 필터링
                            },
                        },
                    },
                ],
                where: {
                    productId: {
                        [Op.in]: Sequelize.literal(`(SELECT productId FROM Likes)`)
                    }
                },
                order: [['productId', 'DESC']],
            });

            const jsonProducts = productsWithImage.map(product => product.toJSON());
            console.log("result >> ", typeof jsonProducts)
            const updatedLikes = jsonProducts.map(product => {                
                const profileImgUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/product/${product.productId}`;
                return {
                    ...product, // 기존의 속성들을 유지
                    ProductImages: product.ProductImages.map(image => ({
                        productImage: `${profileImgUrl}/${image.productImage}` // 새로운 형식으로 변경
                    }))
                };
            });
            console.log("updatedLikes > ", updatedLikes);
            ///
            
            console.log('pinfo > ', updatedLikes);

            if (productsWithImage.length === 0) {
                res.send('좋아요 내역이 존재하지 않습니다.');
            } else {
                res.send(updatedLikes);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'buySellLikesList 서버 오류', err: err.message });
    }
};
// 결제하기 버튼 클릭시
exports.postPayment = async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.userId;
        console.log('req.userId >>>  ', buyerId);
        // 구매자 정보 저장 
        const result = await Product.update(
            { buyerId: parseInt(buyerId) },
            {
                where: { productId },
            }
        );
        if (result === 1) {
            console.log('상태 수정 실패');
        } else {
            console.log('상태 수정 완료 !🌟');
        }

        // 구매자 머니 차감
        const pay = await User.findOne({
            include: [
                {
                    model: Product,
                    attributes: ['buyerId', 'price'],
                    where: {
                        buyerId: parseInt(buyerId),
                    },
                },
            ],
            raw: true,
        });
        if (parseInt(pay.money) > 0) {
            const moneyToAdmin = await User.decrement(
                { money: parseInt(pay['Products.price']) },
                {
                    where: { userId: pay.userId },
                }
            );
            const balance = await User.findOne({ where: { userId: [buyerId] }, raw: true });

            console.log('moneyToAdmin > ', moneyToAdmin);
            res.send({ '결제완료 !': 'true', userId: balance.userId, 잔액: balance.money });
        } else {
            res.send('머니가 부족합니다. 충전해!! ');
        }
        // console.log('pay > ', pay, pay.money, pay['Products.price']);
    } catch (err) {
        res.status(500).json({ message: 'postPayment 서버 오류', err: err.message });
    }
};

// 판매 내역 - 상품 판매 수락/거절/발송완료
exports.postSellCheck = async (req, res) => {
    try {
        // const userId = 1; // 판매자 (로그인유저)
        const userId = req.userId; //구매자

        // console.log("req > ",req.session.userId);
        console.log('req.body > ', req.body);

        var { productId, status } = req.body;

        if (status == 'yes') {
            console.log('판매자가 수락 버튼 클릭');

            // 상품 상태 변경
            var result = await Product.update(
                { status: '배송대기중' },
                {
                    where: { productId, userId },
                }
            );
            var val = result == 1 ? `${status} 상태값 변경 성공` : '상태값 변경 실패';
        } else if (status === 'no') {
            console.log('판매자가 거절 버튼 클릭');
            const result = await Product.update(
                { status: '판매중', buyerId: null },
                {
                    where: { productId, userId },
                }
            );
            res.send('판매자가 거절버튼을 클릭하였습니다.');
        } else if (status === 'send') {
            console.log('판매자가 발송완료 버튼 클릭');
            const result = await Product.update(
                { status: '배송중' },
                {
                    where: { productId, userId },
                }
            );

            val = result == 1 ? `${status} 상태값 변경 성공` : '상태값 변경 실패';
            // 30초 뒤에 배송완료
            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

            console.log('배송 시작');
            await sleep(10000); // 배송상태 10초 후 변경

            console.log('배송 완료');

            // 상품 상태 변경
            const ch = await Product.update(
                { status: '배송완료' },
                {
                    where: { productId, userId },
                }
            );
            val = ch == 1 ? `${status} 상태값 변경 성공` : '상태값 변경 실패';
            res.send(val);
        } else {
            res.send(`${status}는 잘못된 인자값 입니다.(yes/no)만 입력필요`);
        }
    } catch (err) {
        res.status(500).json({ message: 'postSellCheck 서버 오류 : 구매자 정보가 없습니다. ', err: err.message });
    }
};

// 구매내역 - 상품확인/거절 버튼 클릭시
exports.postProductCheck = async (req, res) => {
    try {
        // console.log("req > ",req.session.userId);
        const buyerId = req.userId; // 구매자 (로그인유저)
        console.log('req.body > ', req.body);
        var { productId, status, price, userId } = req.body; //userId : 판매자
        var data = status == 'yes' ? '거래(정산)완료' : '판매중';
        console.log('status > ', status);
        const pay = await User.findOne({
            include: [
                {
                    model: Product,
                    attributes: ['buyerId', 'price', 'userId'],
                    where: {
                        userId,
                    },
                },
            ],
            raw: true,
        });
        console.log('pay > ', pay.userId, pay.money, pay['Products.userId']);

        if (status === 'yes') {
            console.log('구매자가 상품 확인 완료 버튼 클릭');

            const moneyToSeller = await User.increment(
                { money: parseInt(pay['Products.price']) },
                {
                    where: { userId: pay['Products.userId'] },
                }
            );

            // 상품 상태 변경
            const result = await Product.update(
                { status: data },
                {
                    where: { productId, buyerId },
                }
            );
            val = result == 1 ? `${status} 상태값 변경 성공` : '상태값 변경 실패';
        } else if (status === 'no') {
            //거절 클릭시
            console.log('구매자가 거절 버튼 클릭');
            const moneyToBuyer = await User.increment(
                { money: parseInt(pay['Products.price']) },
                {
                    where: { userId: pay.userId },
                }
            );

            // 상품 상태 변경
            const result = await Product.update(
                { status: data },
                {
                    where: { productId, buyerId },
                }
            );
            val = result == 1 ? `${status} 상태값 변경 성공` : '상태값 변경 실패';
            res.send(val);
        } else {
            res.send(`${data}는 잘못된 인자값 입니다.(yes/no)만 입력필요`);
        }
    } catch (err) {
        res.status(500).json({ message: 'postProductCheck 서버 오류', err: err.message });
    }
};

// 찜 내역 삭제
exports.deleteLikesDelete = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
        const { productId } = req.query;
        const userId = req.userId;
        const result = await isLoginUser(req, res);

        if(result) {
            const isDeleted = await Likes.destroy({
                where: { productId , userId },
            });
            console.log('삭제완료 >> ', isDeleted);
            if (isDeleted === 1) {
                res.send('삭제 성공 !🌟');
            } else {
                res.send('삭제할 데이터가 존재하지 않습니다. ');
            }
        }

    } catch (err) {
        res.status(500).json({ message: 'deleteLikesDelete 서버 오류', err: err.message });
    }
};
