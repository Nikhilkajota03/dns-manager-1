import express from 'express';
import { getAllUsers, registerUser , loginUser , verify } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/all', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser );
router.post('/verify',verify)

export default router;



