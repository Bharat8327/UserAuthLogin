import express from 'express';
import getUserData from '../controller/userController.js';
import userAuth from '../middleware/userAuth.js';
const router = express.Router();

router.get('/data', userAuth, getUserData);

export default router;
