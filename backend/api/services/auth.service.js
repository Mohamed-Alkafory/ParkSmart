const User = require('../models/user.model');

/**
 * Auth Service — المنطق الخاص بالتسجيل وتسجيل الدخول
 *
 * ليه service منفصلة؟
 *   عشان الـ controller يفضل خفيف — بياخد الـ request، يبعته للـ service، ويرجع الـ response
 *   الـ service هي اللي بتشتغل مع الـ DB وبتعمل الـ logic
 */

// TODO: استدعي الـ bcrypt وعمل register, login functions هنا
// مثال للـ pattern المتوقع:

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env.config');

/**
 * registerUser
 * TODO: اعمل الخطوات دي:
 *   1. تحقق إن الـ email مش موجود في الـ DB
 *   2. عمل hash للـ password
 *   3. ساف الـ User في الـ DB
 *   4. ارجع بيانات المستخدم (من غير password)
 *
 * @param {{ name, email, password, role, phone }} userData
 * @returns {Promise<Object>} user data
 */
async function registerUser(userData) {
  // TODO: implement
}

/**
 * loginUser
 * TODO: اعمل الخطوات دي:
 *   1. دور على الـ User بالـ email
 *   2. قارن الـ password بالـ hashed password في الـ DB (bcrypt.compare)
 *   3. لو صح، اعمل JWT token
 *   4. ارجع الـ token وبيانات المستخدم
 *
 * @param {{ email, password }} credentials
 * @returns {Promise<{ token, user }>}
 */
async function loginUser(credentials) {
  // TODO: implement
}

module.exports = { registerUser, loginUser };
