class Player {
    constructor() {
        this.audio = new Audio();
        this.musicaAtual = null;
        this.volumeAnterior = 1; // Guardar volume anterior para função mute
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Select de música
        const selectMusica = document.getElementById('selecao_musica');
        selectMusica.addEventListener('change', () => this.carregarMusica(selectMusica.value));

        // Botões de controle
        document.getElementById('btn_anterior').addEventListener('click', () => this.tocarAnterior());
        document.getElementById('btn_play').addEventListener('click', () => this.togglePlay());
        document.getElementById('btn_proximo').addEventListener('click', () => this.tocarProximo());

        // Atualizar barra de progresso
        this.audio.addEventListener('timeupdate', () => this.atualizarProgresso());
        document.getElementById('barra_progresso').addEventListener('click', (e) => this.mudarProgresso(e));

        // Adicionar eventos de volume
        const volumeControl = document.getElementById('volume_control');
        const btnMute = document.getElementById('btn_mute');

        volumeControl.addEventListener('input', (e) => this.ajustarVolume(e.target.value));
        btnMute.addEventListener('click', () => this.toggleMute());

        // Definir volume inicial
        this.ajustarVolume(volumeControl.value);
    }

    async carregarMusica(musicaId) {
        if (!musicaId) return;

        try {
            const select = document.getElementById('selecao_musica');
            const option = select.options[select.selectedIndex];
            
            this.musicaAtual = {
                titulo: option.text.split(' - ')[0],
                nome_artista: option.text.split(' - ')[1]
            };
            
            this.audio.src = `/musica/${musicaId}`;
            
            document.getElementById('musica_titulo').textContent = this.musicaAtual.titulo;
            document.getElementById('musica_info').textContent = this.musicaAtual.nome_artista;
            
            await this.audio.play();
            this.atualizarBotaoPlay();
        } catch (error) {
            console.error('Erro ao carregar música:', error);
        }
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
        this.atualizarBotaoPlay();
    }

    atualizarBotaoPlay() {
        const btnPlay = document.getElementById('btn_play');
        if (this.audio.paused) {
            btnPlay.innerHTML = `
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>`;
        } else {
            btnPlay.innerHTML = `
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>`;
        }
    }

    atualizarProgresso() {
        const progresso = (this.audio.currentTime / this.audio.duration) * 100;
        document.querySelector('.bg-purple-500').style.width = `${progresso}%`;
    }

    mudarProgresso(event) {
        const barra = document.getElementById('barra_progresso');
        const rect = barra.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const porcentagem = x / rect.width;
        this.audio.currentTime = this.audio.duration * porcentagem;
    }

    tocarAnterior() {
        const select = document.getElementById('selecao_musica');
        const options = Array.from(select.options);
        const currentIndex = options.findIndex(opt => opt.value === select.value);
        if (currentIndex > 0) {
            select.value = options[currentIndex - 1].value;
            this.carregarMusica(select.value);
        }
    }

    tocarProximo() {
        const select = document.getElementById('selecao_musica');
        const options = Array.from(select.options);
        const currentIndex = options.findIndex(opt => opt.value === select.value);
        if (currentIndex < options.length - 1) {
            select.value = options[currentIndex + 1].value;
            this.carregarMusica(select.value);
        }
    }

    ajustarVolume(valor) {
        const volume = valor / 100;
        this.audio.volume = volume;
        this.atualizarIconeVolume(volume);
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.volumeAnterior = this.audio.volume;
            this.audio.volume = 0;
            document.getElementById('volume_control').value = 0;
        } else {
            this.audio.volume = this.volumeAnterior;
            document.getElementById('volume_control').value = this.volumeAnterior * 100;
        }
        this.atualizarIconeVolume(this.audio.volume);
    }

    atualizarIconeVolume(volume) {
        const btnMute = document.getElementById('btn_mute');
        
        if (volume === 0) {
            btnMute.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
                    </path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2">
                    </path>
                </svg>`;
        } else if (volume < 0.5) {
            btnMute.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
                    </path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15.536 8.464a5 5 0 010 7.072">
                    </path>
                </svg>`;
        } else {
            btnMute.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.012l-6-4.5H2v-3h4l6-4.5v12z">
                    </path>
                </svg>`;
        }
    }
} 