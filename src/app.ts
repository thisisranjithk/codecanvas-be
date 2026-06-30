import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/index.js';
import { generateOpenAPI } from './config/swagger.js';
import { errorHandler } from './shared/errors/index.js';
import './shared/types/express-request.js';
import routes from './routes/index.js';

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(generateOpenAPI(), {
      swaggerOptions: {
        deepLinking: false,
      },
    }),
  );
}

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
