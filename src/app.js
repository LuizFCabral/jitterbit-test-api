import express from 'express';
import router from './router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger-output.json' with { type: 'json' };


const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

export default app;