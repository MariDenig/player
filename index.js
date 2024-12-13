const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + '/app/visao'));
app.use('/js', express.static(__dirname + '/app/visao/js'));

app.set('view engine', 'ejs');
app.set('views', './app/visao');

const Artista = require("./app/modelo/artista");
const Album = require("./app/modelo/album");
const Musica = require("./app/modelo/musica");

const controleArtista = require("./app/controle/controle-artista");
const controleAlbum = require("./app/controle/controle-album");
const controleMusica = require("./app/controle/controle-musica");

const upload = require('./app/config/multer');

app.get('/', (req, res) => {
    res.render('index');
});

app.get("/cadastrar-artista", (req, res) => {
    async function cadastrar() {
        try {
            if (!req.query.nome || !req.query.genero) {
                res.status(400).send("Nome e gênero são obrigatórios");
                return;
            }

            var artista = new Artista(req.query.nome, req.query.genero);
            var r = await controleArtista.insertArtista(artista);
            res.redirect('/');
        } catch (error) {
            console.error("Erro ao cadastrar artista:", error);
            res.status(500).send("Erro ao cadastrar artista: " + error.message);
        }
    }
    cadastrar();
});

app.get("/cadastrar-album", (req, res) => {
    async function cadastrar() {
        try {
            if (!req.query.nome || !req.query.ano) {
                res.status(400).send("Nome e ano são obrigatórios");
                return;
            }
            
            var album = new Album(req.query.nome, req.query.ano);
            var r = await controleAlbum.insertAlbum(album);
            res.redirect('/');
        } catch (error) {
            console.error("Erro ao cadastrar álbum:", error);
            res.status(500).send("Erro ao cadastrar álbum: " + error.message);
        }
    }
    cadastrar();
});

app.post("/cadastrar-musica", upload.single('arquivo_musica'), (req, res) => {
    async function cadastrar() {
        try {
            if (!req.file) {
                throw new Error('Arquivo de música é obrigatório');
            }

            var musica = new Musica(
                req.body.titulo,
                req.body.duracao,
                req.body.id_album,
                req.body.id_artista
            );

            var r = await controleMusica.insertMusica(musica, req.file);
            res.redirect('/');
        } catch (error) {
            console.error("Erro ao cadastrar música:", error);
            res.status(500).send("Erro ao cadastrar música: " + error.message);
        }
    }
    cadastrar();
});

// Rotas para obter dados
app.get("/artistas", async (req, res) => {
    var artistas = await controleArtista.getAllArtistas();
    res.json(artistas);
});

app.get("/albuns", async (req, res) => {
    var albuns = await controleAlbum.getAllAlbums();
    res.json(albuns);
});

app.get("/musicas", async (req, res) => {
    var musicas = await controleMusica.getAllMusicas();
    res.json(musicas);
});

app.get("/musica/:id", async (req, res) => {
    try {
        const musica = await controleMusica.getMusicaById(req.params.id);
        if (!musica || !musica.arquivo_musica) {
            res.status(404).send("Música não encontrada");
            return;
        }
        
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', musica.arquivo_musica.length);
        
        res.send(musica.arquivo_musica);
    } catch (error) {
        console.error("Erro ao buscar música:", error);
        res.status(500).send("Erro ao buscar música");
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

