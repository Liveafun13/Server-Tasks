import express from 'express';
import { verifyToken } from '../lib/middleware.js';

import {
getUser,
updateUser,
deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/:id', verifyToken, getUser);
router.patch('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;