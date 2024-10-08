const db = require('../../models/Index');
const { User, Active } = require('../../models/Index');
const { checkActive } = require("../../service/activeService")

// 머니 충전
exports.postMoney = async(req, res) => {
    try {
        const { money } = req.body;
        const userId = req.params.userId;

        // 활동 정지 여부 체크
        await checkActive(userId);

        await User.update(
            { money: db.sequelize.literal(`money + ${money}`) }, 
            { where: { userId }}
        );

        const user = await User.findOne({ where: { userId }});
        
        res.status(201).json({message: `충전이 완료되었습니다. 충전된 금액 ${money}원, 잔액 ${user.money}원 입니다.` });

    } catch(err) {
        if (err.message === "비활성화 된 계정입니다.") return res.status(403).json({ message: err.message });
        
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}
