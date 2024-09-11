const { Active } = require('../models/Index');
const reportService = require("./reportService")

exports.createActive = async (userId, isAdmin, isActive) => {
    if (userId !== undefined && isAdmin !== undefined && isActive !== undefined) {
        
        await Active.create({ userId, isAdmin, isActive });
    
        return { userId, isAdmin, isActive };

    } else {
        throw new Error("유저상태가 올바르지 않습니다.");
    }
    
};

exports.updateActive = async (userId, isAdmin, isActive) => {
    if (userId !== undefined && isAdmin !== undefined && isActive !== undefined) {
        
        await Active.update(
            { isAdmin, isActive },
            { where: { userId }}
        );
    
        return { isAdmin, isActive };

    } else {
        throw new Error("유저상태가 올바르지 않습니다.");
    }
};


exports.updateActiveInAdminPage = async (req, res) => {
    try {
        const userId = req.params.userId;
        const isActive = req.body.isActive;

    await Active.update(
        { isActive },
        { where: { userId }}
    );

    return res.status(200).json({ message: '유저 상태가 성공적으로 변경되었습니다.' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
    

}


exports.checkActive = async (userId) => {
    const activeUser = await Active.findOne({ where: { userId } });
    if (!activeUser) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }

    try {
        const userReportCount = await reportService.getReportCountByUserId(userId);
        if (userReportCount > 20) {
            const isAdmin = activeUser.isAdmin;
            await updateActive(userId, isAdmin, 0);
        }
    } catch (error) {
        throw new Error("상태 업데이트 중 오류가 발생했습니다.");
    }

    if (activeUser.isActive === 0) {
        throw new Error("비활성화 된 계정입니다.");
    }

    return activeUser;
};




exports.deleteActive = async (userId) => {
    await Active.destroy(
        { where: { userId } }
    );
    return { message: '유저상태 삭제가 완료 되었습니다.' };
};

