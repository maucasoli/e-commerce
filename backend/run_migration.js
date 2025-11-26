import db from './src/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
    try {
        console.log("Running migration...");
        await db.query(`
      ALTER TABLE \`liste_items\`
      ADD COLUMN \`quantite_achetee\` int(11) NOT NULL DEFAULT 0 CHECK (\`quantite_achetee\` >= 0);
    `);
        console.log("Migration successful: Column 'quantite_achetee' added.");
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Migration skipped: Column 'quantite_achetee' already exists.");
            process.exit(0);
        }
        console.error("Error running migration:", err);
        process.exit(1);
    }
}

runMigration();
