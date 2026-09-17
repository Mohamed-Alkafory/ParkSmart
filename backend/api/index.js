const express = require("express");
const cors = require("cors");
const path = require("path");

const { PORT } = require("./config/env.config");
const connectDB = require("./config/db.config");
const errorHandler = require("./middlewares/errorHandler");
const passport = require("./config/passport");

// Routes
const authRoutes          = require('./routes/auth.routes');
const parkingsRoutes      = require('./routes/parkings.routes');
const spotsRoutes         = require('./routes/spots.routes');
const bookingsRoutes      = require('./routes/bookings.routes');
const reviewsRoutes       = require('./routes/reviews.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const userRoutes          = require('./routes/user.routes');

const app = express();

// ─── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ─── DB Connection ─────────────────────────────────────────────
connectDB();

// ─── Uploaded images (multer local disk: backend/uploads) ─────────
// Must stay before the /api routes so GET /uploads/<file> is served directly.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/parkings',      parkingsRoutes);
app.use('/api/spots',         spotsRoutes);
app.use('/api/bookings',      bookingsRoutes);
app.use('/api/reviews',       reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use("/api/users",          userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "ParkSmart API is running 🚀" });
});

// ─── Error Handler (must stay last) ───────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
