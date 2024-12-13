async function carregarArtistas() {
    try {
        const response = await fetch('/artistas');
        const artistas = await response.json();
        const select = document.getElementById('id_artista');
        
        select.innerHTML = '<option value="">Selecione um artista</option>';
        artistas.forEach(artista => {
            select.innerHTML += `<option value="${artista.id}">${artista.nome}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar artistas:', error);
    }
}

async function carregarAlbuns() {
    try {
        const response = await fetch('/albuns');
        const albuns = await response.json();
        const select = document.getElementById('id_album');
        
        select.innerHTML = '<option value="">Selecione um álbum</option>';
        albuns.forEach(album => {
            select.innerHTML += `<option value="${album.id}">${album.nome} (${album.ano})</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar álbuns:', error);
    }
}

async function carregarMusicas() {
    try {
        const response = await fetch('/musicas');
        const musicas = await response.json();
        const select = document.querySelector('#selecao_musica');
        
        select.innerHTML = '<option value="">Escolha uma música</option>';
        musicas.forEach(musica => {
            select.innerHTML += `<option value="${musica.id}">${musica.titulo} - ${musica.nome_artista}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar músicas:', error);
    }
}

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarArtistas();
    carregarAlbuns();
    carregarMusicas();
}); 