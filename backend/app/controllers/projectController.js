const createError = require('http-errors');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { toApiShape, toApiList } = require('../utils/transform');

exports.getAll = async (req, res, next) => {
  try {
    const list = await Project.find().sort({ _id: -1 }).lean();
    res.json({
      success: true,
      message: 'Projects list retrieved successfully.',
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
    const doc = await Project.findById(id).lean();
    if (!doc) return next(createError(404, 'Project not found'));
    res.json({
      success: true,
      message: 'Project retrieved successfully.',
      data: toApiShape(doc),
    });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, completion, description } = req.body;
    if (!title || completion == null) {
      return next(createError(400, 'title and completion are required'));
    }
    const created = await Project.create({
      title,
      completion,
      description: description ?? '',
    });
    res.status(201).json({
      success: true,
      message: 'Project added successfully.',
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
    const { title, completion, description } = req.body;
    const updated = await Project.findByIdAndUpdate(
      id,
      { title, completion, description },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return next(createError(404, 'Project not found'));
    res.json({
      success: true,
      message: 'Project updated successfully.',
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
    const removed = await Project.findByIdAndDelete(id);
    if (!removed) return next(createError(404, 'Project not found'));
    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (e) {
    next(e);
  }
};
