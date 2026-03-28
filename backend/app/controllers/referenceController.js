const createError = require('http-errors');
const mongoose = require('mongoose');
const Reference = require('../models/Reference');
const { toApiShape, toApiList } = require('../utils/transform');

function normalizeBody(body) {
  return {
    firstname: body.firstname ?? body.firstName,
    lastname: body.lastname ?? body.lastName,
    email: body.email,
    position: body.position ?? '',
    company: body.company ?? '',
  };
}

exports.getAll = async (req, res, next) => {
  try {
    const list = await Reference.find().sort({ _id: -1 }).lean();
    res.json({
      success: true,
      message: 'References list retrieved successfully.',
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
    const doc = await Reference.findById(id).lean();
    if (!doc) return next(createError(404, 'Reference not found'));
    res.json({
      success: true,
      message: 'Reference retrieved successfully.',
      data: toApiShape(doc),
    });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const payload = normalizeBody(req.body);
    if (!payload.firstname || !payload.lastname || !payload.email) {
      return next(createError(400, 'firstname, lastname, and email are required'));
    }
    const created = await Reference.create(payload);
    res.status(201).json({
      success: true,
      message: 'Reference added successfully.',
      data: toApiShape(created),
    });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid id'));
    }
    const payload = normalizeBody(req.body);
    const updated = await Reference.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return next(createError(404, 'Reference not found'));
    res.json({
      success: true,
      message: 'Reference updated successfully.',
    });
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid id'));
    }
    const removed = await Reference.findByIdAndDelete(id);
    if (!removed) return next(createError(404, 'Reference not found'));
    res.json({
      success: true,
      message: 'Reference deleted successfully.',
    });
  } catch (e) {
    next(e);
  }
};
