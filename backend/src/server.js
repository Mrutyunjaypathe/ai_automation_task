import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';

// Routes
import authRoutes from './routes/auth.js';
import workflowRoutes from './routes/workflows.js';
import runRoutes from './routes/runs.js';
import connectorRoutes from './routes/connectors.js';

// Middleware
import { errorHandler } from './lib/middleware/errorHandler.js';
import { rateLimiter } from './lib/middleware/rateLimiter.js';
import logger from './lib/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/connectors', connectorRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
