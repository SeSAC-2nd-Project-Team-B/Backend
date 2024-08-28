const express = require('express');
const router = express.Router();

const Ruser = require('./Ruser');
const Rroom = require('./Rroom');
const Rcoupon = require('./Rcoupon');
const Rproduct = require('./Rproduct');

router.use("/user", Ruser);
router.use("/room", Rroom);
router.use("/coupon", Rcoupon);
router.use("/product", Rproduct);



// 404 처리 // 제일 마지막 위치
router.use((req, res, next) => {
    res.status(404).send('🚫 404 Error')
});

module.exports = router;