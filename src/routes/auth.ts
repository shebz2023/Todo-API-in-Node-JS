import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/User';
import Joi from 'joi';

const router = express.Router();

// Validation schema for user registration
const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Validation schema for user login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err: any, token: string | undefined) => {
            if (err) throw err;
            if (token) {
                res.json({ token });
            } else {
                throw new Error('Token generation failed');
            }
        });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err: any, token: string | undefined) => {
            if (err) throw err;
            if (token) {
                res.json({ token });
            } else {
                throw new Error('Token generation failed');
            }
        });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

export default router;
