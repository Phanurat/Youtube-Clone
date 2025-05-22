const pool = require('../config/database');

async function getAllUsers() {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
}

async function createUser(name) {
  const res = await pool.query('INSERT INTO users(name) VALUES($1) RETURNING *', [name]);
  return res.rows[0];
}

module.exports = {
  getAllUsers,
  createUser,
};
