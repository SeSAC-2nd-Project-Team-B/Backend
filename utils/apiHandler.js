// 네이버 검색 API 
const express = require('express');
const app = express();

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

exports.getNproductPrice = async (req, res) => {

    const query = req.query.query;
    console.log("query > ",query);
    
    
    const url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURIComponent(query);
    const ClientID = process.env.NAVER_CLIENT_ID;
    const ClientSecret = process.env.NAVER_CLIENT_SECRET;
    
    try {
      const response = await axios.get(url, {
        params:{
          display: 10,
          sort: 'asc',

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

      
      if(extractData.length === 0){  
        res.send('해당 키워드로 검색된 상품의 최저가 정보가 없습니다.😥');
      }
      res.send(extractData);
    } catch (err) {
      return `error : ${err.message}`

    }
  };

