import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './database/db.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.route.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Ensure database connection middleware for serverless invocations
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP, please try later"
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// CORS configuration (handles origin reflection for local & production URLs)
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive fallback for multi-preview deployments
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept"
    ]
}));

app.get('/', (req, res) => {
    res.send('Floranextech backend');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Floranextech API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Message / enquiry routes
app.use('/api/message', messageRoutes);

//Admin routes
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Route not found" });
});

// Start server for local development
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`Server is running at ${PORT}`);
            });
        } catch (error) {
            console.error("Database connection failed:", error);
            process.exit(1);
        }
    };
    startServer();
}

export default app;
