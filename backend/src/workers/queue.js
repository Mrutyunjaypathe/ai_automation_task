import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import logger from '../lib/logger.js';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

export const workflowQueue = new Queue('workflow-execution', { connection });

export const enqueueWorkflowRun = async (runId, workflow) => {
    await workflowQueue.add('execute-workflow', {
        runId,
        workflowId: workflow.id,
        spec: workflow.spec_json,
    }, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    });

    logger.info(`Enqueued workflow run: ${runId}`);
};

export default { workflowQueue, enqueueWorkflowRun };
