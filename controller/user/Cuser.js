const db = require('../../models/Index');
const { User, Location, Active } = require('../../models/Index');
const { Op } = require('sequelize');
const encUtil = require("../../utils/encrypt");
const locationService = require('../../service/locationService');
const activeService = require('../../service/activeService');

// 유저 생성 // 회원가입
exports.postUser = async(req, res) => {
    try {
        const { nickname, email, password, gender, age, profile_image, isAdmin, isActive,
                depth1, depth2, depth3, depth4, 
              } = req.body;
        
        const hashedPassword = await encUtil.hashPw(password);

        const newUser = await User.create({
            nickname, email, password: hashedPassword, gender, age, profile_image
        });
        
        
        const locationData = { depth1, depth2, depth3, depth4 };
        const newLocation = await locationService.createLocation(newUser.userId, locationData);
        const newActive = await activeService.createActive(newUser.userId, isAdmin, isActive);
        

        res.status(201).json({ newUser, newLocation, newActive });

    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}


// 전체 유저 목록 조회 // 회원검색 (전체 or 닉네임)
exports.getUserList = async(req, res) => {
    try {
        const { nickname } = req.query;
        
        let users;
        if (nickname) {
            // 닉네임이 주어진 경우
            users = await User.findAll({
                where: {
                    nickname: {
                        [Op.like]: `%${nickname}%`
                    }
                },

                ...includeData
            });

            // 정확히 일치하는 유저를 상단에 배치
            const exactMatches = users.filter(user => user.nickname === nickname);
            const partialMatches = users.filter(user => user.nickname !== nickname);
            users = [...exactMatches, ...partialMatches];

        } else {
            // 닉네임이 주어지지 않은 경우 (전체 검색)
            users = await User.findAll({
                ...includeData
            });
        }

        if (users.length === 0) return res.status(404).json({ message: '일치하는 회원이 없습니다.' });
        

        res.status(200).json({ totalUsers: users.length, users: users });

    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}


// 특정 유저 한명 조회
exports.getUser = async (req, res) => { 
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ 
            where: { userId },

            ...includeData
        });

        if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });

        return res.status(200).json(user);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}


// 특정 유저 내용 수정 
exports.patchUser = async(req, res) => {
    try {
        const { nickname, password, newPassword, gender, age, profile_image, isAdmin, isActive,
            depth1, depth2, depth3, depth4 
        } = req.body;
        
        const userId = req.params.userId;
        
        // 존재하는 유저인지 확인
        const user = await User.findOne({ where: { userId } });
        if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
        
        const updateData = {};
        
        // 기존 비밀번호와 비교
        const isMatch = await encUtil.comparePw(password, user.password);

        if (!isMatch) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });

        // 비밀번호 변경 
        if (newPassword) {
            const hashedPassword = await encUtil.hashPw(newPassword); // 비밀번호 해싱
            updateData.password = hashedPassword;
        }

        const locationData = { depth1, depth2, depth3, depth4 };
        const patchedLocation = await locationService.updateLocation(user.userId, locationData);
        const patchedActive = await activeService.updateActive(user.userId, isAdmin, isActive);

        if (age) updateData.age = age;
        if (gender) updateData.gender = gender;
        if (nickname) updateData.nickname = nickname;

        // 유저 정보 업데이트
        await User.update(updateData, { where: { userId } });

        return res.status(200).json({ message: '회원정보가 성공적으로 업데이트되었습니다.' });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


// 특정 유저 삭제
exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
          
    try {
        const user = await User.findOne({ where: { userId } });
        if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });

        await User.destroy({ where: { userId } });
        
        res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
      
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: '서버 오류', err: err.message });
    }
  };


  // 조회 시 포함 정보 // 중복 삭제
  const includeData = {
    include : [
        {
            model: Location,
            attributes: ['depth1', 'depth2', 'depth3', 'depth4']
        },
        {
            model: Active,
            attributes: ['isAdmin', 'isActive']
        }
    ]   
  }