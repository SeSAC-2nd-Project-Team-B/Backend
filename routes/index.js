const express = require('express');
const router = express.Router();

const Ruser = require('./Ruser');
const Rroom = require('./Rroom');
const Rcoupon = require('./Rcoupon');

router.use("/user", Ruser);
router.use("/room", Rroom);
router.use("/coupon", Rcoupon);



// 404 처리 // 제일 마지막 위치
router.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = router;
