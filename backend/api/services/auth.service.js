const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = require("../config/env.config");

/**
 * Auth Service
 * المنطق الخاص بالتسجيل وتسجيل الدخول
 */

// ===================== Register =====================

async function registerUser(userData) {
  const { name, email, password, phone } = userData;

  // 1. التأكد إن الـ email مش موجود
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // 2. التحقق من قوة الـ password قبل الـ hashing
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  // 3. عمل hash للـ password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. إنشاء الـ User
  // role مش بناخده من المستخدم عشان محدش يقدر يسجل نفسه admin
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  // 5. إخفاء الـ password قبل إرجاع البيانات
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
}

// ===================== Login =====================

async function loginUser(credentials) {
  const { email, password } = credentials;

  // 1. البحث عن المستخدم بالـ email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. مقارنة الـ password بالـ hashed password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // 3. إنشاء JWT Token
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  // 4. إخفاء الـ password
  const userResponse = user.toObject();
  delete userResponse.password;

  // 5. إرجاع الـ token وبيانات المستخدم
  return {
    token,
    user: userResponse,
  };
}

module.exports = {
  registerUser,
  loginUser,
};

