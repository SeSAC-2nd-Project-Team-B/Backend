const { Product, Report } = require('../models/Index');
var sequelize = require('sequelize');

exports.getReport = async (req, res) => {
    try {
        const { productId } = req.query;
        const report = await report.findOne({
            where: {
                productId,
            },
            attributes: [[sequelize.fn('SUM', sequelize.col('reportCount')), 'totalLike']],
            raw: true
        });
        console.log("report >> ", Report.totalLike);
        if (Report.totalLike) {
            res.status(400).json({ "totalReport": Report.totalLike });
        } else {
            res.send('해당 상품은 신고 개수가 조회되지 않습니다.');
        }
    } catch (err) {
        res.status(500).json({ message: 'getReport 서버 오류', err: err.message });
    }
};

exports.postReportProduct = async (req, res) => {
    const loginId = req.userId;
    const { productId, userId } = req.query;

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