const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { Active } = require("../models/Index")

// 세션 생성
exports.createSession = async(req, userId, isActive, isAdmin) => {
    req.session.userId = userId;
    req.session.isActive = isActive;
    req.session.isAdmin= isAdmin;
};

exports.deleteSession = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: '로그아웃 처리 중 오류가 발생했습니다.' });
      }

      return res.status(200).json({ message: "로그아웃 성공" });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: '서버 오류', err: err.message });
  };
};



// 토큰 생성
exports.createToken = (sessionID) => {
  return jwt.sign(
    { sessionID },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};



// 토큰에서 userId 확인 (디버깅용)
exports.getUserInfoByToken = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log('11111');

    const { token } = req.body;
    console.log("🚀 ~ token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const sessionId = decoded.sessionID;
      console.log("🚀 ~ sessionId:", sessionId);

      // Express 메모리 세션 스토어에서 세션 데이터 가져오기 // 비동기
      req.sessionStore.get(sessionId, (err, session) => {
        if (err || !session) {
          return reject(new Error("세션이 유효하지 않습니다."));
        }

        const { userId, isAdmin } = session;
        console.log("🚀 ~ req.sessionStore.get ~ userId, isAdmin:", userId, isAdmin);

        req.userId = userId;
        req.isAdmin = isAdmin;

        resolve({ userId, isAdmin });
      });

    } catch (err) {
      return reject(new Error("유효하지 않은 토큰입니다."));
    }
  });
}


// 유저 본인 또는 관리자인지 확인
const admin = "admin";
const adminOrUser = "adminOrUser";

exports.authenticate = (accessType) => {
  
  return (req, res, next) => {
    
    try {

      // Authorization 헤더에서 토큰 추출
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const sessionId = decoded.sessionID;

      // 세션 확인
      if (!req.session || req.sessionID !== sessionId) {
        return res.status(401).json({ message: "세션이 유효하지 않습니다." });
      }

      // 세션에서 사용자 정보 확인
      const { userId, isAdmin } = req.session;
      

      if (!userId) {
        return res.status(401).json({ message: "사용자 정보가 세션에 없습니다." });
      }

      /**
       * 관리자: 모든 경우 접근 허용
       * 사용자: 본인의 것만 접근 허용
       * 
       * 본인 또는 관리자 접근 가능한 경우 
       * - decoded한 세션값과 조회하고자하는 파라미터를 비교하여 조회하고자 하는 것이 본인의 것인지 확인
       * - 만약 파라미터가 없는 경우 (ex.postRoom) 해당 코드 내에서 세션값과 body값 직접 비교
       * 
       * 관리자만 접근 가능한 경우
       * - decode한 세션값에서 관리자권한이 있는 지 확인 후 권한이 있다면 모든 접근 허용
       * - 파라미터가 있다면 해당코드에서 파라미터 기준으로 코드 실행, 권한만 관리자일 뿐
       * - 만약 해당 코드에서 파라미터가 아닌 userId를 넣게 되면,
       * - 관리자 본인의 userId로 실행되므로 의도한 바와 다른 결과가 도출됨
       */

      // 본인 또는 관리자 접근 가능한 경우 (파라미터가 있는 경우, 세션과 파라미터 비교)
      if (accessType === adminOrUser && req.params.userId && userId !== parseInt(req.params.userId, 10) && !isAdmin) {
        return res.status(403).json({ message: "접근 권한이 없습니다." });
      }
      
      // 관리자만 접근 가능한 경우
      if (accessType === admin && !isAdmin) {
        return res.status(403).json({ message: "관리자가 아닙니다." });
      }


      // 사용자 정보 요청 객체에 추가
      req.userId = userId;
      req.isAdmin = isAdmin;

      next();

    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "서버 오류", err: err.message });
    }
  };
};

exports.admin = admin;
exports.adminOrUser = adminOrUser;
