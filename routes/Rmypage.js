const express = require('express');
const controller = require('../controller/product/Cproduct');
const likesController = require('../service/likesService');
const reportController = require('../service/reportService');
const { authenticate, adminOrUser, admin } = require("../middleware/auth");
const router = express.Router();

// 기본 요청 경로 localhost:PORT/

router.get('/buy/:userId', authenticate(adminOrUser), controller.getBuyList)
