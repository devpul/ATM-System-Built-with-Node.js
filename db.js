const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'bachdar16538029', // sesuaikan
  database: 'db_atm' // sesuaikan
});

module.exports = db;
