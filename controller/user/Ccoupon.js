const db = require('../../models/Index');
const { Coupon } = require('../../models/user/CouponModel');
const { Op } = require('sequelize');

// 쿠폰 생성
exports.postCoupon = async(req, res) => { }

// 전체 쿠폰 리스트 조회
exports.getCouponList = async(req, res) => { }

// 특정 쿠폰 한개 조회
exports.getCoupon = async(req, res) => { }

// 특정 유저 소유 쿠폰 목록 조회
exports.getCouponListByUserId = async(req, res) => { }

// 특정 쿠폰 내용 수정
exports.patchCoupon = async(req, res) => { }

// 특정 쿠폰 삭제
exports.deleteCoupon = async(req, res) => { }