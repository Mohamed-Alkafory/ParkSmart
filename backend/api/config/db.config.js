const mongoose = require('mongoose');

/**
 * connectDB
 * بتوصّل التطبيق بـ MongoDB باستخدام الـ URI اللي في ملف .env
 * بيتستدعى مرة واحدة في index.js عند بداية تشغيل السيرفر
 */
async function connectDB() {
  const connectionString = process.env.MONGO_URI;

  if (!connectionString) {
    console.error('❌ MONGO_URI مش موجودة في ملف .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionString);
    console.log('✅ DB Connected');
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
