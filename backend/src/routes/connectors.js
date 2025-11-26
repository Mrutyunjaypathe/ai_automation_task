import express from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db/index.js';
import { authenticate } from '../lib/middleware/auth.js';

const router = express.Router();

const connectorSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('http', 'smtp', 'google_sheets', 'notion', 'slack', 'twilio').required(),
    config: Joi.object().required(),
});

// Get all connectors
router.get('/', authenticate, async (req, res) => {
    const result = await db.query(
        'SELECT id, owner_id, name, type, config, created_at FROM connectors WHERE owner_id = $1',
        [req.user.id]
    );
    res.json(result.rows);
});

// Create connector
router.post('/', authenticate, async (req, res) => {
    const { error } = connectorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: { message: error.details[0].message } });
    }

    const { name, type, config } = req.body;
    const id = uuidv4();

    const result = await db.query(
        `INSERT INTO connectors (id, owner_id, name, type, config)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, owner_id, name, type, config, created_at`,
        [id, req.user.id, name, type, JSON.stringify(config)]
    );

    res.status(201).json(result.rows[0]);
});

// Delete connector
router.delete('/:id', authenticate, async (req, res) => {
    const result = await db.query(
        'DELETE FROM connectors WHERE id = $1 AND owner_id = $2 RETURNING id',
        [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Connector not found' } });
    }

    res.json({ message: 'Connector deleted' });
});

export default router;
