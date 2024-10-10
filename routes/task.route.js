import express from 'express';
import {
  getTask,
  getTaskByUser,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';
import { verifyToken } from '../lib/middleware.js';

const router = express.Router();

router.get('/:id', verifyToken, getTask);
router.get('/user/:id', verifyToken, getTaskByUser);
router.post('/create', verifyToken, createTask);
router.patch('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

export default router;