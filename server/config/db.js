const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "analytics_db"
});

module.exports = db;