const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./utils/logger');

const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');

dotenv.config();

const app = express();
const server = http.createServer(app);
const LOCAL_HOSTS = ['localhost', '127.0.0.1'];
const isAllowedDevOrigin = (origin) => {
  try {
    const url = new URL(origin);
    return LOCAL_HOSTS.includes(url.hostname);
  } catch (err) {
    return false;
  }
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.CLIENT_URL === origin || isAllowedDevOrigin(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO Logic
io.on('connection', (socket) => {
  logger.info(`👤 A user connected: ${socket.id}`);

  socket.on('join', (userId) => {
    socket.join(userId);
    logger.info(`🏠 User ${userId} joined their personal room`);
  });

  // Receive driver location updates and broadcast to clients
  socket.on('driver:location', async (payload) => {
    try {
      if (!payload || !payload.userId || !payload.coords) return;

      // Persist driver location (optional)
      await User.findByIdAndUpdate(payload.userId, {
        location: { type: 'Point', coordinates: [payload.coords.lng, payload.coords.lat] },
        isOnline: true,
      });

      // Broadcast location to all connected clients (can be optimized to rooms/nearby)
      io.emit('driver-location', {
        id: payload.userId,
        lat: payload.coords.lat,
        lng: payload.coords.lng,
        timestamp: payload.timestamp || Date.now(),
      });
    } catch (err) {
      logger.error('Error handling driver:location', err);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`🔌 User disconnected: ${socket.id}`);
  });
});

// Attach io to app to use in controllers
app.set('io', io);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.CLIENT_URL === origin || isAllowedDevOrigin(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' })); // Limit body size

// Data sanitization against NoSQL query injection
// express-mongo-sanitize middleware is incompatible with Express 5 because
// req.query is a getter-only property. Sanitize request body and params only.
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params);
  }
  next();
});

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: { message: 'Too many attempts. Please try again later.' },
});
app.use('/api/auth', authLimiter);

// Strict Rate limiter for booking routes (prevent spam)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 booking requests per window
  message: { message: 'Booking limit reached. Please try again later.' }
});
app.use('/api/bookings', bookingLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Cab Booking API (Socket.IO Enabled)' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));

// Global error handler (must be last)
app.use(errorHandler);

// Database connection & server start
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      logger.warn('⚠️ No MONGO_URI provided. Server running without database.');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} with Socket.IO`);
  });
});

module.exports = app;
