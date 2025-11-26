import db from './src/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkSchema() {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM liste_items LIKE 'quantite_achetee'");
    if (rows.length > 0) {
      console.log("Column 'quantite_achetee' EXISTS.");
    } else {
      console.log("Column 'quantite_achetee' DOES NOT EXIST.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error checking schema:", err);
    process.exit(1);
  }
}

checkSchema();
