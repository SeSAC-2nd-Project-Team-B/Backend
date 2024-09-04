const sequelize = require('sequelize');
const Op = sequelize.Op;
const { User, Product, ProductImage, Likes, Report } = require('../../models/Index');
const { getLikes, postLikes } = require('../../service/likesService');
const { getReport, postReportProduct } = require('../../service/reportService');

// 구매 및 판매 및 찜 내역
exports.buySellLikesList = async (req, res) => {
    try {
        // const userId = req.session.userId;
        const userId = 1;
        console.log("req > ", req.session.userId);

        var { mypageList } = req.body;
        var findCol = (mypageList === "buy") ? 'buyerId'
            : (mypageList === "sell" || mypageList === "likes") ? 'userId'
            : 'nono';

        console.log("mypageList > ", mypageList, findCol)
        if (findCol == 'nono') res.send('잘못된 인자값'); 
        if(mypageList === 'buy' || mypageList === 'sell')    {
        var result = await Product.findAll({
            where: {
                [findCol]: userId
            },
            order: [['productId', 'DESC']],
        });
        if (result.length === 0) {
            console.log('내역이 존재하지 않습니다.')
        } else {
            res.send(result);
        }
        
        console.log('length >> ', result.length);
    }else if(mypageList === 'likes'){
        const pInfo = await Likes.findAll(
            {
                include: [{
                    model: Product,
                    attributes: ['productId','productName','price','status'],
                    where: {
                        userId
                    }
                }],
            });        
        console.log("pinfo > ",pInfo.map(item => item.Product));
        
        if (pInfo.length === 0) {
            res.send('좋아요 내역이 존재하지 않습니다.')
        } else {
            res.send(pInfo.map(item => item.Product));
        }
    }
    } catch (err) {
        res.status(500).json({ message: 'getBuyList 서버 오류', err: err.message });
    }
}

// 판매 내역 - 상품 판매 수락/거절/발송완료
exports.postSellCheck = async (req, res) => {
    try {
        const userId = 1; // 판매자 (로그인유저)
        // const userId = req.session.userId; //구매자

        // console.log("req > ",req.session.userId);
        console.log("req.body > ", req.body);

        var { productId, status } = req.body;

        if (status == 'yes') {
            
            console.log("판매자가 수락 버튼 클릭")
            // 구매자 머니 차감
            const pay = await User.findOne(
                {
                    include: [{
                        model: Product,
                        attributes: ['buyerId', 'price'],
                        where: {
                            userId
                        }
                    }],
                    // attributes: ['money'],
                    raw: true
                });

            console.log("pay > ", pay.userId, pay.money, pay['Products.price']);

            // 구매자 머니 출금
            const moneyToAdmin = await User.decrement(
                { money: parseInt(pay['Products.price']) },
                {
                    where:
                        { userId: pay.userId }
                });
            console.log("payy > ", moneyToAdmin);

            // 상품 상태 변경
            var result = await Product.update(
                { status: "배송대기중" },
                {
                    where: { productId, userId },
                }
            );
            var val = (result == 1) ? `${status} 상태값 변경 성공` : '상태값 변경 실패'

        } else if (status === 'no') {
            console.log("판매자가 거절 버튼 클릭")
            const result = await Product.update(
                { status: "판매중", buyerId: null },
                {
                    where: { productId, userId },
                }
            );
            res.send('판매자가 거절버튼을 클릭하였습니다.')
        } else if (status === 'send') {
            console.log("판매자가 발송완료 버튼 클릭");
            const result = await Product.update(
                { status: "배송중" },
                {
                    where: { productId, userId },
                }
            );

            val = (result == 1) ? `${status} 상태값 변경 성공` : '상태값 변경 실패'
            // 30초 뒤에 배송완료 
            const sleep = delay =>
                new Promise(resolve => setTimeout(resolve, delay));

            console.log("배송 시작");
            await sleep(10000); // 배송상태 10초 후 변경

            console.log("배송 완료");

            // 상품 상태 변경
            const ch = await Product.update(
                { status: "배송완료" },
                {
                    where: { productId, userId },
                }
            );
            val = (ch == 1) ? `${status} 상태값 변경 성공` : '상태값 변경 실패'
            res.send(val);
        }

        else {
            res.send(`${status}는 잘못된 인자값 입니다.(yes/no)만 입력필요`)
        }

    } catch (err) {
        res.status(500).json({ message: 'postSellCheck 서버 오류 : 구매자 정보가 없습니다. ', err: err.message });
    }
}


// 구매내역 - 상품확인/거절 버튼 클릭시
exports.postProductCheck = async (req, res) => {
    try {
        // const userId = req.session.userId ; // 구매자 (로그인한유저)
        // console.log("req > ",req.session.userId);
        const buyerId = 2; // 구매자 (로그인유저)
        console.log("req.body > ", req.body);
        var { productId, status, price, userId } = req.body;
        var data = (status == 'yes') ? '거래(정산)완료' : '판매중';
        console.log("status > ", status);
        const pay = await User.findOne(
            {
                include: [{
                    model: Product,
                    attributes: ['buyerId', 'price', 'userId'],
                    where: {
                        userId
                    }
                }],
                raw: true
            });
        console.log("pay > ", pay.userId, pay.money, pay['Products.userId']);

        if (status === 'yes') {
            console.log("구매자가 상품 확인 완료 버튼 클릭");
            
            const moneyToSeller = await User.increment(
                { money: parseInt(pay['Products.price']) },
                {
                    where: { userId: pay['Products.userId'] }
                });

            // 상품 상태 변경
            const result = await Product.update(
                { status: data },
                {
                    where: { productId, buyerId },
                }
            );
            val = (result == 1) ? `${status} 상태값 변경 성공` : '상태값 변경 실패'
        } else if (status === 'no') //거절 클릭시
        {
            console.log("구매자가 거절 버튼 클릭");
            const moneyToBuyer = await User.increment(
                { money: parseInt(pay['Products.price']) },
                {
                    where: { userId: pay.userId }
                });

            // 상품 상태 변경
            const result = await Product.update(
                { status: data },
                {
                    where: { productId, buyerId },
                }
            );
            val = (result == 1) ? `${status} 상태값 변경 성공` : '상태값 변경 실패'
            res.send(val);
        } else {
            res.send(`${data}는 잘못된 인자값 입니다.(yes/no)만 입력필요`)
        }
    } catch (err) {
        res.status(500).json({ message: 'postProductCheck 서버 오류', err: err.message });
    }
}


// default
exports.postSellCheck1 = async (req, res) => {
    try {
        console.log("req.body > ", req.body);

    } catch (err) {
        res.status(500).json({ message: 'getBuyList 서버 오류', err: err.message });
    }
}