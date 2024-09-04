const { Product, Report } = require('../models/Index');
var sequelize = require('sequelize');

exports.getReport = async (req, res) => {
    try {
        const productId = req;
        console.log('productId', productId);
        const report = await Report.findOne({
            where: {
                productId,
            },
            attributes: [[sequelize.fn('SUM', sequelize.col('reportCount')), 'totalReport']],
            raw: true,
        });
        console.log('report >> ', report.totalReport);
        var reportCnt = report.totalReport ? report.totalReport : 0;
        return reportCnt;
    } catch (err) {
        res.status(500).json({ message: 'getReport 서버 오류', err: err.message });
    }
};

// 신고 버튼 클릭시
exports.postReportProduct = async (req, res) => {
    console.log('req.body > ', req.body);

    const { userId, productId } = req.body; //userId : 글 작성자

    try {
        const existReport = await Report.findOne({
            where: { productId, userId: req.session.userId },
        });

        // 신고 내역 확인
        if (existReport) {
            // 신고 있으면 취소
            await Report.destroy({ where: { productId, userId: req.session.userId } });

            return res.status(200).json({ message: `신고가 취소 되었습니다.`, Report });
        } else {
            // 신고 증가
            await Report.create({ productId, userId: req.session.userId, reportCount: 1 });
            return res.status(200).json({ message: `신고가 추가 되었습니다.`, Report });
        }
    } catch (err) {
        return res.status(500).json({ message: 'postReportProduct 서버 오류', err: err.message });
    }
};

// 특정 유저의 신고 수 합산
exports.getReportCountByUserId = async (userId) => {
    const products = await Product.findAll({ where: { userId } });

    if (products.length === 0) {
        console.log('등록된 상품이 없습니다.');
        return 0;
    }

    let userReportCount = 0;
    for (const product of products) {
        const reportCount = await Report.count({ where: { productId: product.productId } });
        userReportCount += reportCount;
    }

    return userReportCount;
};
