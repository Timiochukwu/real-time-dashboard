// routes/auth.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { User } from '../models/User.js';
const router = express.Router();
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.details.map(d => d.message)
            });
        }
        const { email, password } = value;
        console.log('Login attempt for email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('User found:', user.email);
        const isValidPassword = await user.comparePassword(password);
        console.log('Password comparison result:', isValidPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Register (for testing purposes)
router.post('/register', async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.details.map(d => d.message)
            });
        }
        const { email, password, name } = value;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
