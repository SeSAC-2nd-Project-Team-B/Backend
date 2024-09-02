// 네이버 검색 API 
const express = require('express');
const app = express();

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

exports.getNproductPrice = async (req, res) => {

    const query = req;
    console.log('query > ',query);
    
    const url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURIComponent(query);
    const ClientID = process.env.NAVER_CLIENT_ID;
    const ClientSecret = process.env.NAVER_CLIENT_SECRET;
    
    try {
      const response = await axios.get(url, {
        params:{
          display: 10,
          sort: 'sim',

        },
        headers: {
          "X-Naver-Client-Id": ClientID,
          "X-Naver-Client-Secret": ClientSecret,
        },
      });
      
      const obj = {};
      
      response.data.items.forEach(v => (obj[v.productId]=v));
      // console.log(obj);
      let sortedItem = Object.keys(obj).map(key => obj[key])
                      .sort((a,b) => parseInt(a.lprice) - parseInt(b.lprice));
      const extractData = Object.keys(sortedItem).map(key =>{
        const newProduct = sortedItem[key];
        return {
          title: newProduct.title,
          link: newProduct.link,
          lprice: newProduct.lprice,
          mallName: newProduct.mallName
        };
      })
      return extractData;
      
      if(Object.keys(extractData).length === 0){  
        return '해당 키워드로 검색된 상품의 최저가 정보가 없습니다.😥';
      }
    } catch (err) {
      res.status(500).json({ error: err.message });

    }
  };

