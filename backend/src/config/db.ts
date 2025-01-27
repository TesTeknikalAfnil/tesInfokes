import mariadb from 'mariadb';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'roxas',
    database: 'explorer_db',
    connectionLimit: 10, // Tingkatkan dari 5 ke 10 atau lebih
    connectTimeout: 10000 // Timeout 10 detik
});

export default pool;
