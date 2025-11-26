import express from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db/index.js';
import { authenticate } from '../lib/middleware/auth.js';
import { enqueueWorkflowRun } from '../workers/queue.js';

const router = express.Router();

// Validation schema
const workflowSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    spec_json: Joi.object().required(),
});

// Get all workflows
router.get('/', authenticate, async (req, res) => {
    const result = await db.query(
        'SELECT * FROM workflows WHERE owner_id = $1 ORDER BY updated_at DESC',
        [req.user.id]
    );
    res.json(result.rows);
});

// Get workflow by ID
router.get('/:id', authenticate, async (req, res) => {
    const result = await db.query(
        'SELECT * FROM workflows WHERE id = $1 AND owner_id = $2',
        [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Workflow not found' } });
    }

    res.json(result.rows[0]);
});

// Create workflow
router.post('/', authenticate, async (req, res) => {
    const { error } = workflowSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: { message: error.details[0].message } });
    }

    const { name, description, spec_json } = req.body;
    const id = uuidv4();

    const result = await db.query(
        `INSERT INTO workflows (id, owner_id, name, description, spec_json, status, llm_prompt_version)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
        [id, req.user.id, name, description || '', JSON.stringify(spec_json), 'draft', 'v1']
    );

    res.status(201).json(result.rows[0]);
});

// Update workflow
router.put('/:id', authenticate, async (req, res) => {
    const { error } = workflowSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: { message: error.details[0].message } });
    }

    const { name, description, spec_json } = req.body;

    const result = await db.query(
        `UPDATE workflows 
     SET name = $1, description = $2, spec_json = $3, updated_at = NOW()
     WHERE id = $4 AND owner_id = $5
     RETURNING *`,
        [name, description || '', JSON.stringify(spec_json), req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Workflow not found' } });
    }

    res.json(result.rows[0]);
});

// Delete workflow
router.delete('/:id', authenticate, async (req, res) => {
    const result = await db.query(
        'DELETE FROM workflows WHERE id = $1 AND owner_id = $2 RETURNING id',
        [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Workflow not found' } });
    }

    res.json({ message: 'Workflow deleted' });
});

// Dry run
router.post('/:id/dry-run', authenticate, async (req, res) => {
    const workflow = await db.query(
        'SELECT * FROM workflows WHERE id = $1 AND owner_id = $2',
        [req.params.id, req.user.id]
    );

    if (workflow.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Workflow not found' } });
    }

    // Simulate dry run
    res.json({
        success: true,
        message: 'Dry run completed successfully',
        simulation: {
            nodes_executed: workflow.rows[0].spec_json.nodes?.length || 0,
            estimated_duration: '~30s',
        },
    });
});

// Run workflow
router.post('/:id/run', authenticate, async (req, res) => {
    const workflow = await db.query(
        'SELECT * FROM workflows WHERE id = $1 AND owner_id = $2',
        [req.params.id, req.user.id]
    );

    if (workflow.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Workflow not found' } });
    }

    // Create workflow run
    const runId = uuidv4();
    const runResult = await db.query(
        `INSERT INTO workflow_runs (id, workflow_id, run_status, input_payload)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [runId, req.params.id, 'pending', JSON.stringify(req.body || {})]
    );

    // Enqueue for execution
    await enqueueWorkflowRun(runId, workflow.rows[0]);

    res.status(202).json(runResult.rows[0]);
});

// Activate workflow
router.post('/:id/activate', authenticate, async (req, res) => {
    const result = await db.query(
        `UPDATE workflows SET status = 'active', updated_at = NOW()
     WHERE id = $1 AND owner_id = $2
     RETURNING *`,
        [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Workflow not found' } });
    }

    res.json(result.rows[0]);
});

// Get workflow runs
router.get('/:id/runs', authenticate, async (req, res) => {
    const result = await db.query(
        `SELECT wr.* FROM workflow_runs wr
     JOIN workflows w ON wr.workflow_id = w.id
     WHERE w.id = $1 AND w.owner_id = $2
     ORDER BY wr.started_at DESC
     LIMIT 50`,
        [req.params.id, req.user.id]
    );

    res.json(result.rows);
});

export default router;
