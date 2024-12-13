const mysql = require('mysql2/promise');

function getPool() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'player_musicas'
    });

    return pool;
}


exports.getPool = getPool;