// backend/src/controllers/authController.ts
import Joi from 'joi';
import { authService } from '../services/authService.js';
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
});
export const authController = {
    async register(req, res) {
        try {
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: error.details.map(d => d.message)
                });
            }
            const { name, email, password } = value;
            const result = await authService.registerUser(name, email, password);
            if (!result.success) {
                return res.status(409).json({ message: result.message });
            }
            res.status(201).json(result);
        }
        catch (error) {
            console.error('Register controller error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: error.details.map(d => d.message)
                });
            }
            const { email, password } = value;
            const result = await authService.loginUser(email, password);
            if (!result.success) {
                return res.status(401).json({ message: result.message });
            }
            res.json(result);
        }
        catch (error) {
            console.error('Login controller error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getMe(req, res) {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const result = await authService.getUserById(req.userId);
            if (!result.success) {
                return res.status(result.message === 'User not found' ? 404 : 400).json({ message: result.message });
            }
            res.json(result.user);
        }
        catch (error) {
            console.error('Get me controller error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
