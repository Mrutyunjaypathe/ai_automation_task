import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import db from '../lib/db/index.js';
import { authenticate } from '../lib/middleware/auth.js';

const router = express.Router();

// Validation schemas
const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Signup
router.post('/signup', async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: { message: error.details[0].message } });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        return res.status(409).json({ error: { message: 'Email already registered' } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        [name, email, hashedPassword, 'member']
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
});

// Login
router.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: { message: error.details[0].message } });
    }

    const { email, password } = req.body;

    // Find user
    const result = await db.query(
        'SELECT id, name, email, password, role FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
    const result = await db.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json(result.rows[0]);
});

export default router;
