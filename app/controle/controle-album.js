const getPool = require("./controle-banco").getPool;

exports.insertAlbum = async function(album) {
    // Validação dos dados
    if (!album.nome || !album.ano) {
        throw new Error("Nome e ano são obrigatórios");
    }

    // Converter ano para número
    const anoNumerico = parseInt(album.ano);
    if (isNaN(anoNumerico)) {
        throw new Error("Ano deve ser um número válido");
    }

    var pool = getPool();
    
    var sql = "INSERT INTO album (nome, ano) VALUES (?, ?)";
    var values = [album.nome, anoNumerico];
    
    try {
        var result = await pool.execute(sql, values);
        return result[0].insertId;
    } catch (error) {
        throw error;
    } finally {
        pool.end();
    }
}

exports.getAllAlbums = async function() {
    var pool = getPool();
    
    var [rows] = await pool.query("SELECT * FROM album");
    
    pool.end();
    
    return rows;
} 