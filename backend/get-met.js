import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: '252544', // เปลี่ยนตามจริง
  port: 5432,
});

async function getAllFiles() {
  try {
    const result = await pool.query('SELECT * FROM files ORDER BY id DESC');
    console.log('All Files:', result.rows);
  } catch (err) {
    console.error('Error fetching files:', err);
  } finally {
    await pool.end();
  }
}

getAllFiles();
