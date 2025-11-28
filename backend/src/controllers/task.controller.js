// src/controllers/task.controller.js
const Task = require('../models/Task');

// CREATE Task  (any logged-in user)
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    next(err);
  }
};

// GET my tasks (owner only – current user)
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// ADMIN: GET all tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('user', 'name email role')
      .sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// GET single task (owner or admin)
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // only owner or admin can view
    if (
      req.user.role !== 'admin' &&
      task.user.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: 'Not allowed to view this task' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// UPDATE task (owner or admin)
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (
      req.user.role !== 'admin' &&
      task.user.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Not allowed to update this task' });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    res.json({ message: 'Task updated', task });
  } catch (err) {
    next(err);
  }
};

// DELETE task (owner or admin)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (
      req.user.role !== 'admin' &&
      task.user.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Not allowed to delete this task' });
    }

    await task.deleteOne();

    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
