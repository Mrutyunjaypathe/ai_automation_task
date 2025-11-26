import bcrypt from 'bcryptjs';
import db from './index.js';
import logger from '../logger.js';

export const seedDatabase = async () => {
    logger.info('Seeding database...');

    try {
        // Create demo user
        const hashedPassword = await bcrypt.hash('password123', 10);

        const userResult = await db.query(
            `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
            ['Demo User', 'admin@example.com', hashedPassword, 'admin']
        );

        if (userResult.rows.length > 0) {
            const userId = userResult.rows[0].id;
            logger.info(`Created demo user: admin@example.com / password123`);

            // Create demo workflow
            const demoWorkflow = {
                trigger: { type: 'cron', cron: '0 8 * * *', tz: 'Asia/Kolkata' },
                nodes: [
                    {
                        id: 'n1',
                        type: 'http_fetch',
                        name: 'Fetch Metrics',
                        config: { url: 'https://api.example.com/metrics' },
                    },
                    {
                        id: 'n2',
                        type: 'llm',
                        name: 'Summarize Data',
                        config: {
                            prompt: 'Summarize the following metrics data in 2-3 sentences: {{n1.output}}',
                        },
                    },
                    {
                        id: 'n3',
                        type: 'email',
                        name: 'Send Summary Email',
                        config: {
                            to: 'admin@example.com',
                            subject: 'Daily Metrics Summary',
                            body: '{{n2.output}}',
                        },
                    },
                ],
                edges: [['n1', 'n2'], ['n2', 'n3']],
            };

            await db.query(
                `INSERT INTO workflows (owner_id, name, description, spec_json, status, llm_prompt_version)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    userId,
                    'Daily Analytics Summary',
                    'Fetches metrics every morning and sends a summary email',
                    JSON.stringify(demoWorkflow),
                    'active',
                    'v1',
                ]
            );

            logger.info('Created demo workflow');

            // Create demo connector
            await db.query(
                `INSERT INTO connectors (owner_id, name, type, config)
         VALUES ($1, $2, $3, $4)`,
                [
                    userId,
                    'Example API',
                    'http',
                    JSON.stringify({ base_url: 'https://api.example.com' }),
                ]
            );

            logger.info('Created demo connector');
        }

        logger.info('Database seeding completed');
    } catch (error) {
        logger.error('Seeding failed:', error);
        throw error;
    }
};

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            logger.error('Seed failed:', error);
            process.exit(1);
        });
}

export default { seedDatabase };
