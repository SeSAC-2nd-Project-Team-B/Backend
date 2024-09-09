const db = require('../../models/Index');
const { User, Location, Active } = require('../../models/Index');
const { Op } = require('sequelize');
const encUtil = require("../../utils/encrypt");
const locationService = require('../../service/locationService');
const activeService = require('../../service/activeService');
const auth = require("../../middleware/auth")
const reportService = require("../../service/reportService");
const chkPwService = require("../../service/chkPwService");

// 유저 생성 // 회원가입
exports.postUser = async(req, res) => {
    try {
        const { nickname, email, password, gender, age, isAdmin, isActive,
                depth1, depth2, depth3, depth4, 
              } = req.body;
        
        const hashedPassword = await encUtil.hashPw(password);

        const newUser = await User.create({
            nickname, email, password: hashedPassword, gender, age
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
        
        // 각 유저에 대해 신고 수 계산
        const usersWithReportCount = [];
        for (const user of users) {
            const userReportCount = await reportService.getReportCountByUserId(user.userId);

            // userReportCount 항목을 스프레드 연산자로 user에 산입하여 usersWithReportCounts에 push
            usersWithReportCount.push({ ...user.toJSON(), userReportCount });
        }

        res.status(200).json({ totalUsers: usersWithReportCount.length, users: usersWithReportCount });

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

        const userReportCount = await reportService.getReportCountByUserId(userId);
        
        // userReportCount 항목을 스프레드 연산자로 user에 산입
        return res.status(200).json({ ...user.toJSON(), userReportCount });
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}


// 특정 유저 내용 수정 
exports.patchUser = async(req, res) => {
    try {
        const { nickname, password, newPassword, gender, age, isAdmin, isActive,
            depth1, depth2, depth3, depth4 
        } = req.body;
        
        const userId = req.params.userId;
        
        // 존재하는 유저인지 확인
        const user = await User.findOne({ where: { userId } });
        if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });

        // 비밀번호 확인
        const passwordCheck = await chkPwService.chkPasswordInPatch(userId, password);
        if (!passwordCheck.success) return res.status(400).json({ message: passwordCheck.message });

        const updateData = {};

        // 비밀번호 변경 
        if (newPassword) {
            const hashedPassword = await encUtil.hashPw(newPassword); // 비밀번호 해싱
            updateData.password = hashedPassword;
        }

        if (depth1 || depth2 || depth3 || depth4) {
            const locationData = { depth1, depth2, depth3, depth4 };
            await locationService.updateLocation(user.userId, locationData);
        }

        // 관리자 권한일 경우에만 활동 상태 업데이트
        let activeUpdatedMessage = false; // 상태 업데이트 여부를 추적
        if ((isAdmin !== undefined || isActive !== undefined) && req.isAdmin) {
            await activeService.updateActive(user.userId, isAdmin, isActive);
            activeUpdatedMessage = true;
        }

        if (age) updateData.age = age;
        if (gender) updateData.gender = gender;
        if (nickname) updateData.nickname = nickname;


        // 업데이트할 정보가 있는지 확인 후 업데이트
        if (activeUpdatedMessage || Object.keys(updateData).length > 0) {
            await User.update(updateData, { where: { userId } });
        } else {
            return res.status(200).json({ message: '변경된 정보가 없습니다.' });
        }

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



// 토큰으로 유저 조회 (디버깅용)
exports.getUserByToken = async (req, res) => {
    try {
      const userInfo = await auth.getUserInfoByToken(req, res);
      if (!userInfo) {
        return res.status(401).json({ message: '토큰이나 세션이 유효하지 않습니다.' });
      }
      
      console.log("🚀 ~ exports.getUserByToken= ~ userInfo:", userInfo);
      if (!userInfo) return;
  
      const { userId } = userInfo;
      console.log("🚀 ~ exports.getUserByToken= ~ userId:", userId);
  
      const user = await User.findOne({ where: { userId } });
      if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
  
      return res.status(200).json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: '서버 오류', err: err.message });
    }
  }

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