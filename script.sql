CREATE DATABASE IF NOT EXISTS player_musicas;
USE player_musicas;

CREATE TABLE artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL
);

CREATE TABLE album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ano INT NOT NULL
);

CREATE TABLE musica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    duracao INT NOT NULL,
    id_album INT,
    id_artista INT,
    FOREIGN KEY (id_album) REFERENCES album(id),
    FOREIGN KEY (id_artista) REFERENCES artista(id),
    arquivo_musica LONGBLOB
); 