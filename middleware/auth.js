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
    { expiresIn: '3d' }
  );
};


const admin = "admin";
const adminOrUser = "adminOrUser";

// 유저 본인 또는 관리자인지 확인
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

      // 본인 또는 관리자 접근 가능한 경우
      if (accessType === adminOrUser && userId !== parseInt(req.params.userId, 10) && !isAdmin) {
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
