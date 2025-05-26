   import pkg from 'pg';
const { Pool } = pkg;

// สร้าง connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: '252544',
  port: 5432,
});

// ฟังก์ชันบันทึกไฟล์
async function uploadFile() {
  const filename = 'video22.mp4';
  const title = 'My First0021 Video';

  try {
    const result = await pool.query(
      'INSERT INTO files (filename, title) VALUES ($1, $2) RETURNING *',
      [filename, title]
    );
    console.log('File uploaded and saved!', result.rows[0]);
  } catch (err) {
    console.error('Error saving file:', err);
  } finally {
    await pool.end();
  }
}

uploadFile();
