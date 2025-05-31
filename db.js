const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sightsmap_schema'
});

module.exports = pool.promise(); // чтобы использовать async/await