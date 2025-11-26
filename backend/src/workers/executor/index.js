import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import db from '../../lib/db/index.js';
import logger from '../../lib/logger.js';
import { executeNode } from '../../connectors/index.js';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

const worker = new Worker(
    'workflow-execution',
    async (job) => {
        const { runId, workflowId, spec } = job.data;

        logger.info(`Starting workflow execution: ${runId}`);

        try {
            // Update run status
            await db.query(
                `UPDATE workflow_runs SET run_status = 'running', started_at = NOW() WHERE id = $1`,
                [runId]
            );

            const context = {}; // Store outputs from previous nodes
            const { nodes, edges } = spec;

            // Execute nodes in order (simple sequential execution for MVP)
            for (const node of nodes) {
                logger.info(`Executing node: ${node.id} (${node.type})`);

                // Create task record
                const taskId = uuidv4();
                await db.query(
                    `INSERT INTO tasks (id, workflow_run_id, node_id, task_status, attempt_count)
           VALUES ($1, $2, $3, $4, $5)`,
                    [taskId, runId, node.id, 'running', 1]
                );

                try {
                    // Execute node
                    const output = await executeNode(node, context);
                    context[node.id] = { output };

                    // Update task status
                    await db.query(
                        `UPDATE tasks SET task_status = 'success', logs = $1, finished_at = NOW()
             WHERE id = $2`,
                        [JSON.stringify({ output }), taskId]
                    );

                    logger.info(`Node ${node.id} completed successfully`);
                } catch (error) {
                    logger.error(`Node ${node.id} failed:`, error);

                    await db.query(
                        `UPDATE tasks SET task_status = 'failed', logs = $1, finished_at = NOW()
             WHERE id = $2`,
                        [JSON.stringify({ error: error.message }), taskId]
                    );

                    throw error; // Fail the entire workflow
                }
            }

            // Mark run as successful
            await db.query(
                `UPDATE workflow_runs 
         SET run_status = 'success', result_summary = $1, finished_at = NOW()
         WHERE id = $2`,
                [JSON.stringify({ nodes_executed: nodes.length, context }), runId]
            );

            logger.info(`Workflow execution completed: ${runId}`);

            return { success: true, runId };
        } catch (error) {
            logger.error(`Workflow execution failed: ${runId}`, error);

            // Mark run as failed
            await db.query(
                `UPDATE workflow_runs 
         SET run_status = 'failed', result_summary = $1, finished_at = NOW()
         WHERE id = $2`,
                [JSON.stringify({ error: error.message }), runId]
            );

            throw error;
        }
    },
    {
        connection,
        concurrency: parseInt(process.env.WORKER_CONCURRENCY) || 5,
    }
);

worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed:`, err);
});

logger.info('🔧 Workflow executor worker started');

export default worker;
