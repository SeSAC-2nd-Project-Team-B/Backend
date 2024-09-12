const express = require("express");
const jwt = require("jsonwebtoken");
// const session = require("express-session");
const { Active } = require("../models/Index")

// // 세션 생성
// exports.createSession = async(req, userId, isActive, isAdmin) => {
//     req.session.userId = userId;
//     req.session.isActive = isActive;
//     req.session.isAdmin= isAdmin;
// };

// exports.deleteSession = async (req, res) => {
//   try {
//     req.session.destroy((err) => {
//       if (err) {
//         console.log(err.message);
//         return res.status(500).json({ message: '로그아웃 처리 중 오류가 발생했습니다.' });
//       }

//       return res.status(200).json({ message: "로그아웃 성공" });
//     });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: '서버 오류', err: err.message });
//   };
// };



// 토큰 생성
exports.createToken = ( userId, isActive, isAdmin) => {
  return jwt.sign(
    { userId, isActive, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};


// 토큰에서 userId 확인 (디버깅용)
exports.getUserInfoByToken = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log('11111');

    const { token } = req.body;  // body에서 토큰 추출
    console.log("🚀 ~ token:", token);

    if (!token) {
      return reject(new Error("토큰이 제공되지 않았습니다."));
    }

    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    console.log("🚀 ~ actualToken:", actualToken);

    try {
      // 토큰을 검증하고 decoded 데이터 추출
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
      const { userId, isAdmin } = decoded;
      console.log("🚀 ~ userId, isAdmin:", userId, isAdmin);

      if (!userId) {
        return reject(new Error("유효하지 않은 사용자입니다."));
      }

      req.userId = userId;
      req.isAdmin = isAdmin;

      resolve({ userId, isAdmin });

    } catch (err) {
      console.log(err.message);
      return reject(new Error("유효하지 않은 토큰입니다."));
    }
  });
}



// 유저 본인 또는 관리자인지 확인
const admin = "admin";
const adminOrUser = "adminOrUser";

exports.authenticate = (accessType) => {
  return (req, res, next) => {
    console.log("req >> ",req);
    try {
      // Authorization 헤더에서 토큰 추출
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId, isActive, isAdmin } = decoded;

      // 비활성화된 계정인지 확인
      if (!isActive) {
        return res.status(403).json({ message: "계정이 비활성화되었습니다." });
      }

      /**
       * 관리자: 모든 경우 접근 허용
       * 사용자: 본인의 것만 접근 허용
       * 
       * 본인 또는 관리자 접근 가능한 경우:
       * - decoded한 토큰의 userId와 요청한 파라미터(req.params.userId)를 비교하여 본인의 데이터에 접근하려는지 확인.
       * - 만약 파라미터가 없는 경우 (ex. postRoom), 토큰에서 가져온 userId와 body값을 비교하여 접근을 허용.
       * 
       * 관리자만 접근 가능한 경우:
       * - decoded된 토큰에서 관리자 권한이 있는지 확인 후, 관리자는 모든 접근을 허용.
       * - 파라미터가 있는 경우, 해당 파라미터에 따라 코드를 실행하되 권한은 관리자임.
       * - 만약 파라미터 대신 관리자 본인의 userId를 넣으면, 관리자의 userId로 실행되므로 의도한 바와 다른 결과가 나올 수 있음.
       */

      // 본인 또는 관리자 접근 허용
      if (accessType === adminOrUser && req.params.userId && userId !== parseInt(req.params.userId, 10) && !isAdmin) {
        return res.status(403).json({ message: "접근 권한이 없습니다." });
      }

      // 관리자만 접근 허용
      if (accessType === admin && !isAdmin) {
        return res.status(403).json({ message: "관리자가 아닙니다." });
      }

      // 사용자 정보 요청 객체에 추가
      req.userId = userId;
      req.isActive = isActive;
      req.isAdmin = isAdmin;

      next();
    } catch (err) {
      return res.status(500).json({ message: "서버 오류", err: err.message });
    }
  };
};

exports.admin = admin;
exports.adminOrUser = adminOrUser;