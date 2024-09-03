const express = require('express');
const router = express.Router();

const Ruser = require('./Ruser');
const Rroom = require('./Rroom');
const Rcoupon = require('./Rcoupon');
const Rloginout = require('./Rloginout');
const Rproduct = require('./Rproduct');
const Rmessage = require('./Rmessage');
const Rmypage = require('./Rmypage');
const Rreview = require('./Rreview');


router.use("/user", Ruser);
router.use("/room", Rroom);
router.use("/coupon", Rcoupon);
router.use('/product', Rproduct);
router.use("/", Rloginout);
router.use('/messages', Rmessage);
router.use('/mypage', Rmypage);
router.use('/review', Rreview);



// 404 처리 // 제일 마지막 위치
router.use((req, res, next) => {
    // res.status(404).render('404');
    res.send("404 Error")
});

module.exports = router;