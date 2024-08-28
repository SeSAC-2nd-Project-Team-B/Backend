const { Location } = require('../models/Index');

exports.createLocation = async (userId, locationData) => {
    const { depth1, depth2, depth3, depth4 } = locationData;

    if (depth1 && depth2 && depth3) {
        await Location.create({
            userId, depth1, depth2, depth3, depth4
        });

        return { userId, depth1, depth2, depth3, depth4 };
    } else {
        throw new Error("주소가 올바르지 않습니다.");
    }
};

exports.updateLocation = async (userId, locationData) => {
    const { depth1, depth2, depth3, depth4 } = locationData;

    console.log(userId);
    
    if (depth1 && depth2 && depth3) {
        await Location.update(
            { depth1, depth2, depth3, depth4 }, 
            { where: { userId } }
        );
    } else {
        throw new Error("주소가 올바르지 않습니다.");
    }
};

exports.deleteLocation = async (userId) => {
    await Location.destroy(
        { where: { userId } }
    );
    return { message: '주소 삭제가 완료 되었습니다.' };
};
