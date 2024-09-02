// 네이버 검색 API 
const express = require('express');
const app = express();

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

exports.getNproductPrice = async (req, res) => {
    const query = "물";
    const url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURIComponent(query);
    const ClientID = process.env.NAVER_CLIENT_ID;
    const ClientSecret = process.env.NAVER_CLIENT_SECRET;
    
    try {
      console.log(`ClientId > ${ClientID} / ClientSecret > ${ClientSecret}`);
      console.log("getNproductPrice");
      const response = await axios.get(url, {
        headers: {
          "X-Naver-Client-Id": ClientID,
          "X-Naver-Client-Secret": ClientSecret,
        },
      });
      console.log(response);
      
      // response.json().then(data =>{
      //   res.send(data);
      // })
      // .catch((err) => next(err));
      
      let data = response.data.items;
      console.log(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });