import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import diamondRoutes from './routes/diamond.routes.js';
import calculatorRoutes from './routes/calculator.routes.js';
import historyRoutes from './routes/history.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security & utils
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120
});
app.use(limiter);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/diamonds', diamondRoutes);
app.use('/api/calculate', calculatorRoutes);
app.use('/api/history', historyRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;
