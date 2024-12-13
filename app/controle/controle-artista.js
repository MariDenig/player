const getPool = require("./controle-banco").getPool;

exports.insertArtista = async function(artista) {
    var pool = getPool();

    var sql = "INSERT INTO artista (nome, genero) VALUES (?, ?)";
    var values = [artista.nome, artista.genero];

    var result = await pool.execute(sql, values);

    pool.end();

    return result[0].insertId;
}

exports.getAllArtistas = async function() {
    var pool = getPool();
    
    try {
        var [rows] = await pool.query("SELECT * FROM artista ORDER BY nome");
        return rows;
    } catch (error) {
        throw error;
    } finally {
        pool.end();
    }
}
