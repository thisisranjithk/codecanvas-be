import express from 'express';

import { errorHandler } from './shared/errors/error-handler.js';
import routes from './routes/index.js';

const app = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
