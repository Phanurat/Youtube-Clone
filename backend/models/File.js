import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

export async function saveFileMetadata(filename, title) {
  const query = `
    INSERT INTO files (filename, title)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [filename, title];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('❌ PostgreSQL error:', err);
    throw err;
  }
}
