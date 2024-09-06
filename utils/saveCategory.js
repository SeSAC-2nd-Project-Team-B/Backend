const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const xlsx = require('xlsx');
const { Category } = require('../models/Index');

exports.saveCategory = async (req, res) => {
    try {
        console.log('here >> saveCategory');

        const workbook = xlsx.readFile('./utils/category_20240905_unique.xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[1]];
        const data = xlsx.utils.sheet_to_json(sheet);
        // console.log('>> ', data);

        const categoryIds = {};
        for (const category of data) {
            // for (i = 458; i < 460; i++) {
            const { 대분류, 중분류, 소분류 } = category;
            console.log(category);
            //
            if (!categoryIds[대분류]) {
                const parentCategory = await Category.create({
                    categoryName: 대분류,
                    parentCategoryId: 0, // 최상위 카테고리이므로 parentId는 0
                    level: 1,
                });
                categoryIds[대분류] = parentCategory.categoryId; // 대분류 ID 저장
                console.log('대분류 카테고리 저장 성공');
                // return;
            }
            if (!categoryIds[중분류]) {
                const subCategory = await Category.create({
                    categoryName: 중분류,
                    parentCategoryId: categoryIds[대분류], // 대분류의 ID를 parentId로 설정
                    level: 2,
                });
                categoryIds[중분류] = subCategory.categoryId; // 중분류 ID 저장
                console.log('중분류 카테고리 저장 성공');
            }
            //
            if (소분류) {
                await Category.create({
                    categoryName: 소분류,
                    parentCategoryId: categoryIds[중분류], // 중분류의 ID를 parentId로 설정
                    level: 3,
                });
                console.log('categoryIds[소분류] >> ', categoryIds[소분류]);
                console.log('소분류 카테고리 저장 성공');
            }
        }
        console.log('카테고리 삽입 완료');
    } catch (error) {
        console.log('카테고리 삽입 오류');
        console.error('saveCategory 서버 오류: ', error); // 오류 출력
        // return res.status(500).json({ message: 'saveCategory 서버 오류', err: error.message }); // JSON 형식으로 응답
    }
};
// exports.modules = saveCategory1;
