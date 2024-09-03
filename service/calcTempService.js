const { Review, User } = require('../models/Index');

// 판매자 온도 계산
exports.updateSellerTemp = async (sellerId) => {
    const reviews = await Review.findAll({ where: { sellerId } });
    if(!reviews) console.log('작성된 리뷰가 없습니다.');
    
    let totalScore = 0;

    reviews.forEach(review => {
        totalScore += review.reviewScore;
    });

    const updatedTemp = 36.5 + totalScore * (reviews.length / 15);
    
    await User.update({ temp: updatedTemp }, { where: { userId: sellerId } });
};