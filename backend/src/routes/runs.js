import express from 'express';
import db from '../lib/db/index.js';
import { authenticate } from '../lib/middleware/auth.js';
import { enqueueWorkflowRun } from '../workers/queue.js';

const router = express.Router();

// Get run by ID
router.get('/:runId', authenticate, async (req, res) => {
    const result = await db.query(
        `SELECT wr.* FROM workflow_runs wr
     JOIN workflows w ON wr.workflow_id = w.id
     WHERE wr.id = $1 AND w.owner_id = $2`,
        [req.params.runId, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Run not found' } });
    }

    res.json(result.rows[0]);
});

// Retry run
router.post('/:runId/retry', authenticate, async (req, res) => {
    const run = await db.query(
        `SELECT wr.*, w.* FROM workflow_runs wr
     JOIN workflows w ON wr.workflow_id = w.id
     WHERE wr.id = $1 AND w.owner_id = $2`,
        [req.params.runId, req.user.id]
    );

    if (run.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Run not found' } });
    }

    // Update run status
    await db.query(
        `UPDATE workflow_runs SET run_status = 'pending', started_at = NOW()
     WHERE id = $1`,
        [req.params.runId]
    );

    // Re-enqueue
    await enqueueWorkflowRun(req.params.runId, run.rows[0]);

    res.json({ message: 'Run retry initiated' });
});

export default router;
