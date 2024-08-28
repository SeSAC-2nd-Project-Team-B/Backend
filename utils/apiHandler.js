// 네이버 검색 API 
const express = require('express');
const app = express();

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const query='물'
var client_id = 'p0LSBEhRYmtR3vLYNxaG';
var client_secret = '8Wp__X5UdR';

app.get("/search", async (req, res) => {
    const query = "나이키";
    const encodedQuery = encodeURIComponent(query);
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodedQuery}`;
    const ClientID = process.env.NAVER_CLIENT_ID;
    const ClientSecret = process.env.NAVER_CLIENT_SECRET;
  
    try {
      const response = await axios.get(url, {
        headers: {
          "X-Naver-Client-Id": ClientID,
          "X-Naver-Client-Secret": ClientSecret,
        },
      });
  
      let data = response.data.items;
      console.log(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });