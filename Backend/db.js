const mysql = require('mysql2');

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',       
  user: 'root',            
  password: 'root',    
  database: 'appointment_db', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


module.exports = db;
