import db from './index.js';
import logger from '../logger.js';

const migrations = [
    {
        name: '001_initial_schema',
        up: async () => {
            // Users table
            await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'member',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

            // Workflows table
            await db.query(`
        CREATE TABLE IF NOT EXISTS workflows (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          spec_json JSONB NOT NULL,
          llm_prompt_version VARCHAR(50),
          status VARCHAR(50) NOT NULL DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

            // Workflow runs table
            await db.query(`
        CREATE TABLE IF NOT EXISTS workflow_runs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
          run_status VARCHAR(50) NOT NULL DEFAULT 'pending',
          input_payload JSONB,
          result_summary JSONB,
          started_at TIMESTAMP DEFAULT NOW(),
          finished_at TIMESTAMP
        )
      `);

            // Tasks table
            await db.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
          node_id VARCHAR(255) NOT NULL,
          task_status VARCHAR(50) NOT NULL DEFAULT 'pending',
          attempt_count INTEGER DEFAULT 0,
          logs JSONB,
          started_at TIMESTAMP DEFAULT NOW(),
          finished_at TIMESTAMP
        )
      `);

            // Connectors table
            await db.query(`
        CREATE TABLE IF NOT EXISTS connectors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          config JSONB NOT NULL,
          secrets_ref VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

            // Secrets table
            await db.query(`
        CREATE TABLE IF NOT EXISTS secrets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          encrypted_payload TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

            // Audit logs table
            await db.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(100) NOT NULL,
          resource_type VARCHAR(100),
          resource_id UUID,
          details JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

            // Create indexes
            await db.query('CREATE INDEX IF NOT EXISTS idx_workflows_owner ON workflows(owner_id)');
            await db.query('CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow ON workflow_runs(workflow_id)');
            await db.query('CREATE INDEX IF NOT EXISTS idx_tasks_run ON tasks(workflow_run_id)');
            await db.query('CREATE INDEX IF NOT EXISTS idx_connectors_owner ON connectors(owner_id)');
            await db.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id)');

            logger.info('Migration 001_initial_schema completed');
        },
    },
];

export const runMigrations = async () => {
    logger.info('Running database migrations...');

    for (const migration of migrations) {
        try {
            await migration.up();
            logger.info(`✓ ${migration.name}`);
        } catch (error) {
            logger.error(`✗ ${migration.name} failed:`, error);
            throw error;
        }
    }

    logger.info('All migrations completed successfully');
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations()
        .then(() => process.exit(0))
        .catch((error) => {
            logger.error('Migration failed:', error);
            process.exit(1);
        });
}

export default { runMigrations };
