const getPool = require("./controle-banco").getPool;

exports.insertMusica = async function(musica, arquivo) {
    var pool = getPool();
    
    var sql = "INSERT INTO musica (titulo, duracao, id_album, id_artista, arquivo_musica) VALUES (?, ?, ?, ?, ?)";
    var values = [musica.titulo, musica.duracao, musica.id_album, musica.id_artista, arquivo.buffer];
    
    try {
        var result = await pool.execute(sql, values);
        return result[0].insertId;
    } catch (error) {
        throw error;
    } finally {
        pool.end();
    }
}

exports.getAllMusicas = async function() {
    var pool = getPool();
    
    var [rows] = await pool.query(`
        SELECT m.*, a.nome as nome_artista, al.nome as nome_album 
        FROM musica m 
        LEFT JOIN artista a ON m.id_artista = a.id
        LEFT JOIN album al ON m.id_album = al.id
    `);
    
    pool.end();
    
    return rows;
}

exports.getMusicaById = async function(id) {
    var pool = getPool();
    
    try {
        var [rows] = await pool.query(`
            SELECT m.*, a.nome as nome_artista, al.nome as nome_album 
            FROM musica m 
            LEFT JOIN artista a ON m.id_artista = a.id
            LEFT JOIN album al ON m.id_album = al.id
            WHERE m.id = ?
        `, [id]);
        
        if (rows[0] && rows[0].arquivo_musica) {
            rows[0].arquivo_musica = Buffer.from(rows[0].arquivo_musica);
        }
        
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        pool.end();
    }
} 