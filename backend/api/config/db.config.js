const mongoose = require('mongoose');

/**
 * connectDB
 * Connects the app to MongoDB using the URI from the .env file.
 * Called once in index.js at server startup.
 */
async function connectDB() {
  const connectionString = process.env.MONGO_URI;

  if (!connectionString) {
    console.error('MONGO_URI is missing in the .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionString);
    console.log('DB Connected');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
