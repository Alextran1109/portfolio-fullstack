const createError = require('http-errors');
const mongoose = require('mongoose');
const Service = require('../models/Service');
const { toApiShape, toApiList } = require('../utils/transform');

exports.getAll = async (req, res, next) => {
  try {
    const list = await Service.find().sort({ _id: -1 }).lean();
    res.json({
      success: true,
      message: 'Services list retrieved successfully.',
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
    const doc = await Service.findById(id).lean();
    if (!doc) return next(createError(404, 'Service not found'));
    res.json({
      success: true,
      message: 'Service retrieved successfully.',
      data: toApiShape(doc),
    });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return next(createError(400, 'title is required'));
    }
    const created = await Service.create({
      title,
      description: description ?? '',
    });
    res.status(201).json({
      success: true,
      message: 'Service added successfully.',
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
    const { title, description } = req.body;
    const updated = await Service.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return next(createError(404, 'Service not found'));
    res.json({
      success: true,
      message: 'Service updated successfully.',
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
    const removed = await Service.findByIdAndDelete(id);
    if (!removed) return next(createError(404, 'Service not found'));
    res.json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (e) {
    next(e);
  }
};
