const express = require('express');
const router = express.Router();

const Ruser = require('./index/Ruser');
const Rroom = require('./index/Rroom');
const Rcoupon = require('./index/Rcoupon');

router.use("/user", Ruser);
router.use("/room", Rroom);
router.use("/coupon", Rcoupon);



// 404 처리 // 제일 마지막 위치
router.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = router;
