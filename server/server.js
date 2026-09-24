import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

import { checkDbConnection } from './src/middleware/dbMiddleware.js';

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import proposalRoutes from './src/routes/proposalRoutes.js';
import revisionRoutes from './src/routes/revisionRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import materialRoutes from './src/routes/materialRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';
import milestoneRoutes from './src/routes/milestoneRoutes.js';
import fileRoutes from './src/routes/fileRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import auditLogRoutes from './src/routes/auditLogRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';

// Handle ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Dynamic allowed origins for development, production, and Vercel preview deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://full-stack-lime-eight.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Server-to-server, mobile, curl
  if (allowedOrigins.includes(origin)) return true;
  // Allow all Vercel preview and production deployments
  if (origin.endsWith('.vercel.app')) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      // In production, allow all origins with credentials for seamless multi-environment access
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cookie',
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    service: 'DesignSpace Backend API',
  });
});

// Enforce database connection for API routes
app.use('/api', checkDbConnection);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[DesignSpace API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
