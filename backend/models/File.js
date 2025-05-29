import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

export async function saveFileMetadata(filename, title, map_id = null) {
  const query = `
    INSERT INTO files (filename, title, map_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [filename, title, map_id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('❌ PostgreSQL error:', err);
    throw err;
  }
}

export async function getAllFiles() {
  const result = await pool.query('SELECT * FROM files ORDER BY id DESC');
  return result.rows;
}

export async function getFileById(id) {
  const result = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateFileMapId(fileId, mapId) {
  const query = `
    UPDATE files SET map_id = $1 WHERE id = $2 RETURNING *;
  `;
  const values = [mapId, fileId];
  const result = await pool.query(query, values);
  return result.rows[0];
}


