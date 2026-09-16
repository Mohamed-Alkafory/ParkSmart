const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = require("../config/env.config");

// ===================== Register =====================

async function registerUser(userData) {
  const { name, email, password, phone } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Role is never taken from user input so nobody can register as admin.
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
}

// ===================== Login =====================

async function loginUser(credentials) {
  const { email, password } = credentials;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

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

  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    token,
    user: userResponse,
  };
}


// ===================== OAuth Find-or-Create =====================

async function findOrCreateOAuthUser({ provider, providerId, email, name }) {
  if (!email) {
    throw new Error('OAuth provider did not return an email address');
  }

  // 1. Find by provider + providerId first (same Google/Facebook account)
  let user = await User.findOne({ provider, providerId });

  if (user) {
    return formatUserResponse(user);
  }

  // 2. Find by email (user may have registered normally before)
  user = await User.findOne({ email });

  if (user) {
    // Link the OAuth provider to the existing account
    user.provider = provider;
    user.providerId = providerId;
    await user.save();
    return formatUserResponse(user);
  }

  // 3. Create new user — always default to "driver"
  user = await User.create({
    name: name || email.split('@')[0],
    email,
    provider,
    providerId,
    role: 'driver',
  });

  return formatUserResponse(user);
}

function formatUserResponse(user) {
  const userResponse = user.toObject();
  delete userResponse.password;

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: userResponse };
}

module.exports = {
  registerUser,
  loginUser,
  findOrCreateOAuthUser,
};
