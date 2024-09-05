const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const xlsx = require('xlsx');
const { Category } = require('../models/Index');

const saveCategory = async (req, res) => {
    try {
        console.log("here >> saveCategory");
        
        const workbook = xlsx.readFile('./utils/shopping_category_20240905.xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let cate1 = [];
        console.log("data", data.length);
        
        for (let i = 0; i < data.length; i++) {
            cate1.push(data[i]['대분류']);
        }

        let unique = [...new Set(cate1)];
        console.log(">> ", unique.length);
        
        let results = []; // 결과를 저장할 배열 초기화
        for (let i = 0; i < unique.length; i++) {
            console.log(">>>>>>>", i);
            
            const result = await Category.create(
                { 
                categoryName: unique[i],
                parentCategoryId: 0,
                level: 1,
            },
    );
            results.push(result); // 결과 저장
        }

        if (results.length > 0) {
            return 'level 1 카테고리 추가 성공';
        } else {
            return 'level 1 카테고리 추가 실패';
        }
        
    } catch (error) {
        console.error("saveCategory 서버 오류: ", error); // 오류 출력
        // return res.status(500).json({ message: 'saveCategory 서버 오류', err: error.message }); // JSON 형식으로 응답
    }
};

const saveCategory2 = async (req, res) => {
    try {
        console.log("here >> saveCategory");
        
        const workbook = xlsx.readFile('./utils/shopping_category_20240905.xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let cate1 = [];
        console.log("data", data.length);
        
        for (let i = 0; i < data.length; i++) {
            cate1.push(data[i]['대분류'],data[i]['중분류']);
        }

        let unique = [...new Set(cate1)];
        console.log(">> ", unique);
        
        let results = []; // 결과를 저장할 배열 초기화
        for (let i = 0; i < unique.length; i++) {
            // console.log(">>>>>>>", unique[i]);
            
            // const result = await Category.create(
            //     { 
            //     categoryName: unique[i],
            //     parentCategoryId: 1,
            //     level: 2,
            // },
    // );
            // results.push(result); // 결과 저장
        }

        if (results.length > 0) {
            return 'level 2 카테고리 추가 성공';
        } else {
            return 'level 2 카테고리 추가 실패';
        }
        
    } catch (error) {
        console.error("saveCategory 서버 오류: ", error); // 오류 출력
        // return res.status(500).json({ message: 'saveCategory 서버 오류', err: error.message }); // JSON 형식으로 응답
    }
};

const saveCategory3 = async (req, res) => {
    try {
        console.log("here >> saveCategory");
        
        const workbook = xlsx.readFile('./utils/shopping_category_20240905.xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let cate1 = [];
        console.log("data", data.length);
        
        for (let i = 0; i < data.length; i++) {
            cate1.push(data[i]['소분류']);
        }

        let unique = [...new Set(cate1)];
        console.log(">> ", unique.length);
        
        let results = []; // 결과를 저장할 배열 초기화
    //     for (let i = 0; i < unique.length; i++) {
    //         console.log(">>>>>>>", i);
            
    //         const result = await Category.create(
    //             { 
    //             categoryName: unique[i],
    //             parentCategoryId: 2,
    //             level: 3,
    //         },
    // );
    //         results.push(result); // 결과 저장
    //     }

        if (results.length > 0) {
            return 'level 1 카테고리 추가 성공';
        } else {
            return 'level 1 카테고리 추가 실패';
        }
        
    } catch (error) {
        console.error("saveCategory 서버 오류: ", error); // 오류 출력
        // return res.status(500).json({ message: 'saveCategory 서버 오류', err: error.message }); // JSON 형식으로 응답
    }
};

module.exports = { saveCategory , saveCategory2, saveCategory3};
