const { Product, ProductImage, NewProduct, Review, Likes, Report } = require('../../models/Index');
console.log("Product > ",Product);


// const { json } = require("sequelize");

// 전체 상품 리스트 /product/?
exports.getProductList = async (req, res) => {
    try {
        console.log('getProductList req.query > ', req.query);
        // const { productId } = req.params.productId;
        const productInfo = await Product.findAll({
            where: product 
          });
          console.log("productInfo : ", productInfo);
        //   const likeCount = await Likes.findOne({
        //     where :  productId 
        //   })
        // res.json(productInfo);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// 상품 상세 페이지 /product/list?product=""
exports.getProduct = async (req, res) => {
    try {
        console.log('getProduct req.params > ', req.params.productId);
        const { productId } = req.params.productId;
        const productInfo = await Product.findOne({
            where: productId 
          });
          console.log("productInfo : ", productInfo);
        //   const likeCount = await Likes.findOne({
        //     where :  productId 
        //   })
          res.json(productInfo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// 상품 등록 페이지 GET /product/write
exports.getProductWrite = async (req, res) => {
    try {
        // res.render('productWrite',{title: '상품 등록 화면'})
        res.send('상품 등록 페이지')

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// 상품 등록 페이지 - 저장 POST /product/write
exports.postProduct = async (req, res) => {
    try {
        const {
            productName,
            userId,
            price,
            content,
            status
        } = req.body
        console.log('등록페이지-저장 req.body > ', req.body);
        
        const secHandProduct = await Product.create({
            productName,
            userId,
            price,
            content,
            status
        });
        // productId를 받기 위한 조회
    const lastProductId = await Product.findOne({
        order: [['createdAt', 'DESC']],

        attributes: ['productId']
      });
      console.log("last productId : ", lastProductId.dataValues);

      if (req.files){
        var imgFileArr = req.files;
        // filename 속성을 추출하는 함수
        const extractFilenames = (imgArr) => {
          const filenames = [];
          for (const key in imgArr) {
            if (Object.prototype.hasOwnProperty.call(imgArr, key)) {
              imgArr[key].forEach((file) => {
                filenames.push(file.filename);
              });
            }}
          return filenames;
        };
        // 추출된 filename들
        const filenames = extractFilenames(imgFileArr);
        for (i = 0; i < filenames.length; i++) {
          console.log("i >> ", i);
          const newSecHandImage = await ProductImage.create({
            productId: lastProductId + 1,
            productImage: filenames[i],
          });
        }
        res.send("saved");
    }
        res.json(req.body);

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// 상품 수정 페이지 /product/update?write
exports.patchProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// 상품 삭제 페이지 /product/delete?productnum=""
exports.patchProduct = async (req, res) => {
    try {
        console.log('req.body > ', req.body);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};
