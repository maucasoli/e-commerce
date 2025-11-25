import db from '../src/db.js';

const migrate = async () => {
    try {
        console.log('Adding quantite_achetee column to liste_items table...');
        await db.query(`
      ALTER TABLE liste_items
      ADD COLUMN quantite_achetee INT NOT NULL DEFAULT 0 CHECK (quantite_achetee >= 0);
    `);
        console.log('Column added successfully.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Error adding column:', err);
        }
    } finally {
        process.exit();
    }
};

migrate();
