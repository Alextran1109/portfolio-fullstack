const createError = require('http-errors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { toApiShape, toApiList } = require('../utils/transform');

function withoutPassword(obj) {
  if (!obj) return obj;
  const { password, ...rest } = obj;
  return rest;
}

function normalizeCreateBody(body) {
  return {
    firstname: body.firstname ?? body.firstName,
    lastname: body.lastname ?? body.lastName,
    email: body.email,
    password: body.password,
    username: body.username,
  };
}

exports.getAll = async (req, res, next) => {
  try {
    const list = await User.find().select('-password').sort({ _id: -1 }).lean();
    res.json({
      success: true,
      message: 'Users list retrieved successfully.',
      data: toApiList(list),
    });
  } catch (e) {
    next(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid id'));
    }
    const doc = await User.findById(id).select('-password').lean();
    if (!doc) return next(createError(404, 'User not found'));
    res.json({
      success: true,
      message: 'User retrieved successfully.',
      data: toApiShape(doc),
    });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const payload = normalizeCreateBody(req.body);
    if (!payload.firstname || !payload.lastname || !payload.email || !payload.password) {
      return next(
        createError(400, 'firstname, lastname, email, and password are required')
      );
    }
    const created = await User.create(payload);
    const plain = created.toObject();
    res.status(201).json({
      success: true,
      message: 'User added successfully.',
      data: toApiShape(withoutPassword(plain)),
    });
  } catch (e) {
    if (e.code === 11000) {
      return next(createError(409, 'Email already registered'));
    }
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid id'));
    }
    const { firstname, lastname, email, password, username } = req.body;
    const update = {};
    if (firstname != null) update.firstname = firstname;
    if (lastname != null) update.lastname = lastname;
    if (email != null) update.email = email;
    if (username != null) update.username = username;
    if (password != null && password !== '') {
      update.password = await bcrypt.hash(password, 10);
    }
    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .lean();
    if (!updated) return next(createError(404, 'User not found'));
    res.json({
      success: true,
      message: 'User updated successfully.',
    });
  } catch (e) {
    if (e.code === 11000) {
      return next(createError(409, 'Email already registered'));
    }
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid id'));
    }
    const removed = await User.findByIdAndDelete(id);
    if (!removed) return next(createError(404, 'User not found'));
    res.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (e) {
    next(e);
  }
};
