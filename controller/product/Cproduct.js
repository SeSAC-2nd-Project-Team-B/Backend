// const { Product, ProductImage, NewProduct, Review, Likes, Report } = require('../models/index');

// 전체 상품 리스트 /product/?
exports.getProductList = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {}
};

// 상품 상세 페이지 /product/?product=""
exports.getProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {}
};

// 상품 등록 페이지 /write
exports.postProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {}
};

// 상품 수정 페이지 /write
exports.patchProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {}
};

// 상품 삭제 페이지 /delete?productnum=""
exports.patchProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {}
};
