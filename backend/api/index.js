const express = require('express');
const cors    = require('cors');

const { PORT }   = require('./config/env.config');
const connectDB  = require('./config/db.config');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const authRoutes          = require('./routes/auth.routes');
const parkingsRoutes      = require('./routes/parkings.routes');
const spotsRoutes         = require('./routes/spots.routes');
const bookingsRoutes      = require('./routes/bookings.routes');
const reviewsRoutes       = require('./routes/reviews.routes');
const notificationsRoutes = require('./routes/notifications.routes');

const app = express();

// ─── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── DB Connection ─────────────────────────────────────────────
connectDB();

// ─── Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/parkings',      parkingsRoutes);
app.use('/api/spots',         spotsRoutes);
app.use('/api/bookings',      bookingsRoutes);
app.use('/api/reviews',       reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ParkSmart API is running 🚀' });
});

// ─── Error Handler (لازم يفضل آخر حاجة) ───────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
