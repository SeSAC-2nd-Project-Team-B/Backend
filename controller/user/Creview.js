const { Review, User } = require("../../models/Index");
const { checkActive } = require("../../service/activeService")
const calcTempService = require("../../service/calcTempService")

// 리뷰 생성
exports.postReview = async (req, res) => {
    try {
        const { productId, sellerId, reviewContent, reviewScore } = req.body;
        const buyerId = req.userId;

        // 활동 정지 여부 체크
        await checkActive(buyerId);

        // 리뷰 생성
        const newReview = await Review.create({ productId, sellerId, buyerId, reviewContent, reviewScore });

        // 판매자 온도 계산
        await calcTempService.updateSellerTemp(sellerId);

        res.status(201).json({ newReview });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};



// 특정 유저의 리뷰 목록 조회 (판매자 또는 구매자 기준)
exports.getReviewListByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type } = req.query;

        let whereFilter;
        let includeFilter;

        if (type === 'seller') {
            whereFilter = { sellerId: userId };
            includeFilter = [{ model: User, as: 'Buyer', attributes: ['nickname'] }];
        } else if (type === 'buyer') {
            whereFilter = { buyerId: userId };
            includeFilter = [{ model: User, as: 'Seller', attributes: ['nickname'] }];
        } else {
            return res.status(400).json({ message: 'type 파라미터가 필요합니다. (seller 또는 buyer)' });
        }

        const reviews = await Review.findAll({
            where: whereFilter,
            include: includeFilter
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: '작성된 리뷰가 없습니다.' });
        }

        res.status(200).json({ totalReviews: reviews.length, reviews });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};



// 특정 리뷰 한개 조회
exports.getReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findOne({
            where: { reviewId },
            include: [
                { model: User, as: 'Buyer', attributes: ['nickname'] },
                { model: User, as: 'Seller', attributes: ['nickname'] }
            ]
        });

        if (!review) {
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }

        res.status(200).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};



// 리뷰 전체 목록 조회 (관리자용)
exports.getReviewList = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, as: 'Buyer', attributes: ['nickname'] },
                { model: User, as: 'Seller', attributes: ['nickname'] }
            ]
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: '작성된 리뷰가 없습니다.' });
        }

        res.status(200).json({ totalReviews: reviews.length, reviews });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


// 특정 리뷰 수정
exports.patchReview = async (req, res) => {
    const { reviewContent, reviewScore } = req.body;
    const buyerId = req.userId;
    const { reviewId } = req.params;

    try {

        // 활동 정지 여부 체크
        await checkActive(buyerId);
        
        const review = await Review.findOne({ where: { reviewId }});
        if (!review) {
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }

        const updateReviewData = {};

        if (reviewContent) updateReviewData.reviewContent = reviewContent;
        if (reviewScore) updateReviewData.reviewScore = reviewScore;

        await Review.update(updateReviewData, { where: { reviewId }});

        const sellerId = review.sellerId;
        
        await calcTempService.updateSellerTemp(sellerId);

        res.status(200).json({ updateReviewData,  message: '리뷰가 성공적으로 수정되었습니다.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}



// 특정 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        const review = await Review.findOne({ where: { reviewId } });
        if (!review) {
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }

        const sellerId = review.sellerId;

        await review.destroy();
        
        await calcTempService.updateSellerTemp(sellerId);

        res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};
