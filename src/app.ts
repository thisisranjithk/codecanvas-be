import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import cookieParser from 'cookie-parser';

import { env } from './config/index.js';
import { generateOpenAPI } from './config/swagger.js';
import { errorHandler } from './shared/errors/index.js';
import './shared/types/express-request.js';
import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);

app.disable('x-powered-by');

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(generateOpenAPI(), {
    swaggerOptions: {
      deepLinking: false,
    },
  }),
);

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
