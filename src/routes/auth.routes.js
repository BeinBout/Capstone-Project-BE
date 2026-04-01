import express from 'express';
import { register, login, logout, verifyMe, googleOAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-oauth', googleOAuth);
router.get('/verify/me', verifyMe);
router.post('/logout', logout);

export default router;