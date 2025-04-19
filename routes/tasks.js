const express = require('express');
const TaskModel = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware
const router = express.Router();

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

// Create a new task
router.post('/create', async (req, res) => {
  const newTask = new TaskModel({
    ...req.body,
    assignedTo: req.user._id, // Assign the task to the authenticated user
  });
  try {
    await newTask.save();
    res.status(201).json(newTask); // Send the created task as response
  } catch (err) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Get all tasks for the logged-in user
router.get('/all', async (req, res) => {
  try {
    const userTasks = await TaskModel.find({ assignedTo: req.user._id });
    res.status(200).json(userTasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Get a specific task by ID
router.get('/single/:taskId', async (req, res) => {
  try {
    const task = await TaskModel.findOne({ _id: req.params.taskId, assignedTo: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// Update a specific task
router.put('/update/:taskId', async (req, res) => {
  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: req.params.taskId, assignedTo: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete a task
router.delete('/delete/:taskId', async (req, res) => {
  try {
    const deletedTask = await TaskModel.findOneAndDelete({ _id: req.params.taskId, assignedTo: req.user._id });
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
