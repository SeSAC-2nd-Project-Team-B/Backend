const swaggerAutogen = require('swagger-autogen')();
const { spawn } = require('child_process');

const swaggerDefinition = {
  info: {
    title: 'My API',
    description: 'API 문서입니다.',
  },
  host: 'localhost:8000',
  schemes: ['http'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

// 실행: node swagger.js
swaggerAutogen(outputFile, endpointsFiles, swaggerDefinition).then(() => {
  console.log('------------Swagger 문서 생성 완료!------------');
});
