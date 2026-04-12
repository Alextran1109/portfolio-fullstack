const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const User = require('../models/User');
const { toApiShape } = require('../utils/transform');

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError(500, 'JWT_SECRET is not configured');
  }
  return jwt.sign({ sub: String(userId) }, secret, { expiresIn: '7d' });
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password) {
      return next(createError(400, 'email and password are required'));
    }
    if (String(password).length < 6) {
      return next(createError(400, 'password must be at least 6 characters'));
    }
    const created = await User.create({
      email: String(email).trim().toLowerCase(),
      password,
      firstname: firstname?.trim() || 'User',
      lastname: lastname?.trim() || 'Member',
    });
    const token = signToken(created._id);
    const plain = created.toObject();
    delete plain.password;
    res.status(201).json({
      success: true,
      message: 'Account created.',
      data: { token, user: toApiShape(plain) },
    });
  } catch (e) {
    if (e.code === 11000) {
      return next(createError(409, 'Email already registered'));
    }
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createError(400, 'email and password are required'));
    }
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return next(createError(401, 'Invalid email or password'));
    }
    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      return next(createError(401, 'Invalid email or password'));
    }
    const token = signToken(user._id);
    const plain = user.toObject();
    delete plain.password;
    res.json({
      success: true,
      message: 'Login successful.',
      data: { token, user: toApiShape(plain) },
    });
  } catch (e) {
    next(e);
  }
};
