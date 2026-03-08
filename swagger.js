import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Jitterbit Test API',
    description: 'Este é um repositório feito para o processo seletivo da empresa Jitterbit'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/router.js'];

swaggerAutogen()(outputFile, routes, doc);