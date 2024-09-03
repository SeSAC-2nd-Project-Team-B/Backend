const { Product, Report } = require('../models/Index');
var sequelize = require('sequelize');

exports.getReport = async (req, res) => {
    try {
        const productId = req;
        const report = await report.findOne({
            where: {
                productId,
            },
            attributes: [[sequelize.fn('SUM', sequelize.col('reportCount')), 'totalLike']],
            raw: true
        });
        console.log("report >> ", Report.reportCount);
        return report ? report.reportCount : 0;
        
    } catch (err) {
        res.status(500).json({ message: 'getReport 서버 오류', err: err.message });
    }
};

exports.postReportProduct = async (req, res) => {
    const loginId = req.userId; //req.session.id
    const { productId, userId } = req

    try {
        const existReport = await Report.findOne({
            where: { productId, userId }
        })

        // 신고 내역 확인
        if (existReport) {
            // 신고 있으면 취소
            await Report.destroy({ where: { productId, userId } });
            Report.reportCount -= 1;
            
            await Report.save();

            return res.status(200).json({ message: `신고가 취소 되었습니다.`, Report });
        }
        else {
            // 신고 증가
            await Report.create({ productId, userId });
            Report.reportCount += 1;
            await Report.save();
            return res.status(200).json({ message: `신고가 추가 되었습니다.`, Report });
        }

    } catch (err) {
        return res.status(500).json({ message: 'postReportProduct 서버 오류', err: err.message });
    }
}


// 특정 유저의 신고 수 합산
exports.getReportCountByUserId = async (userId) => {

    const products = await Product.findAll({ where: { userId } });
    
    if (products.length === 0) {
        console.log("등록된 상품이 없습니다.");
        return 0;
    }
    
    let userReportCount = 0;
    for (const product of products) {
        const reportCount = await Report.count({ where: { productId: product.productId } });
        userReportCount += reportCount;
    }
    
    return userReportCount;
}
