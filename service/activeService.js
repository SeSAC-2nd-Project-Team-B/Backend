const { Active } = require('../models/Index');

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
    const activeUser = await Active.findOne(
        { where : { userId } }
    );

    if (!activeUser || activeUser.isActive === 0) {
        return res.status(403).json({ message: "비활성화 된 계정입니다."})
    }

}

exports.deleteActive = async (userId) => {
    await Active.destroy(
        { where: { userId } }
    );
    return { message: '유저상태 삭제가 완료 되었습니다.' };
};

