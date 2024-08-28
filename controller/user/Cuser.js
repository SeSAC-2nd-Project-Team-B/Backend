const db = require('../../models/Index');
const { User } = require('../../models/user/UserModel');
const { Op } = require('sequelize');
const encUtil = require("../../utils/encrypt");

// 유저 생성
exports.postUser = async(req, res) => {
    try {
        const { nickname, email, password, gender, age, profile_image, isAdmin } = req.body;
        
        const newUser = await User.create({
            nickname, email, password, gender, age, profile_image, isAdmin
        });

        res.status(201).json(newUser);

    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}


// 전체 유저 목록 조회 // 회원 검색 (전체 or 닉네임)
exports.getUserList = async(req, res) => {
    try {
        const { nickname } = req.query;
        
        let users;
        if (nickname) {
            // 닉네임이 주어진 경우
            users = await User.findAll({
                where: {
                    nick: {
                        [Op.like]: `%${nickname}%`
                    }
                }
            });

            // 정확히 일치하는 회원을 상단에 배치
            const exactMatches = users.filter(user => user.nickname === nickname);
            const partialMatches = users.filter(user => user.nickname !== nickname);
            users = [...exactMatches, ...partialMatches];

        } else {
            // 닉네임이 주어지지 않은 경우 (전체 검색)
            users = await User.findAll();
        }

        if (users.length === 0) return res.status(404).json({ message: '일치하는 회원이 없습니다.' });
        
        res.status(200).json(users);

    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}


// 특정 유저 내용 수정 
exports.patchUser = async(req, res) => {
    try {
        const { nickname, profile_image, currentPassword, password, age, gender } = req.body;

        // 존재하는 회원인지 확인
        const userId = req.userId;
        const user = await User.findOne({ where: { userId } });
        if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
        
        const isMatch = await encUtil.comparePw(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
        

        // 비밀번호 변경
        const updateData = {};
        if (password) {

            // 비밀번호 해싱
            const hashedPassword = await encUtil.hashPw(password);

            updateData.password = hashedPassword;

        }

        if (age) { updateData.age = age; };
        if (gender) { updateData.gender = gender; };
        if (nickname) { updateData.nickname = nickname; };

        // 회원 정보 업데이트
        await User.update(updateData, { where: { userId } });

        return res.status(200).json({ message: '회원정보가 성공적으로 업데이트되었습니다.' });

    } catch (err) {
        console.err(err.message);
        return res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


// 특정 유저 삭제
exports.deleteUser = async (req, res) => {
    const userId = req.userId;
      
    try {
      const user = await User.findOne({ where: { userId } });
      if (!user) {
        return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
      }
    
      await User.destroy({ where: { userId } });
  
      res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
      
    } catch (err) {
      console.err(err.message);
      res.status(500).json({ message: '서버 오류', err: err.message });
    }
  };

// 특정 유저 한명 조회
exports.getUser = async (req, res) => { 
    
}