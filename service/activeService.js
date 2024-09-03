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

