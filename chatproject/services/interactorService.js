const axios = require('axios');
const player = require("play-sound")();
const path = require('path');
require('dotenv').config();

// Função para enviar mensagem de texto ao ChatGPT
async function enviarMensagemTexto(message) {
	try {
		const response = await fetch('http://localhost:5000/api/chat/text', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: message }),
		});
		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error('Erro ao gerar resposta de texto:', error);
		return 'Erro ao gerar resposta de texto.';
	}
}

// Função para gerar imagem com ChatGPT
async function enviarMensagemImagem(description) {
	try {
        console.log("Description: " + description);
		const response = await fetch('http://localhost:5000/api/chat/image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: description }),
		});
        const data = await response.json();
		return data.imageUrl;
	} catch (error) {
		console.error('Erro ao gerar imagem:', error);
		return 'Erro ao gerar imagem.';
	}
}

async function receberFotosGatos() {
    try {
        const response = await axios.get('http://localhost:5000/api/images/gato');
		const data = await response.data.imageUrl;
		return data;
    } catch (error) {
        console.log('Erro ao gerar fotos de gatos!', error);
        return 'Erro ao gerar fotos de gatos!';
    }
}


async function receberFotosCachorros(){
	try {
		const response = await axios.get('http://localhost:5000/api/images/cachorro');
		const data = await response.data.imageUrl;
		return data;
	} catch (error) {
		console.log('Erro ao gerar fotos de cachorros!', error);
		return 'Erro ao gerar fotos de cachorros!';
	}
}

async function receberFotosRaposas(){
	try {
		const response = await axios.get('http://localhost:5000/api/images/raposa');
		const data = await response.data.imageUrl;
		return data;
	} catch (error) {
		console.log('Erro ao gerar fotos de raposas!', error);
		return 'Erro ao gerar fotos de raposas!';
	}
}


async function receberFotosArte() {
	try {
		const response = await axios.get('http://localhost:5000/api/images/arte');
		const data = await response.data.imageUrl;
		return data;
	} catch (error) {
		console.log('Erro ao gerar fotos de artes!', error);
		return 'Erro ao gerar fotos de artes!';
	}
}

async function emitirSom(nomeDoSom) {
	console.log(nomeDoSom)
    const soundPath = path.join(__dirname, "../sounds", `${nomeDoSom}.mp3`);
	console.log(soundPath)
    
    // Reproduz o som
    player.play(soundPath, { stdio: "ignore" }, function(err) { // `stdio: "ignore"` para evitar janelas extras
        if (err) console.error("Erro ao reproduzir o som:", err);
        else console.log(`Reproduzindo som: ${nomeDoSom}`);
    });
}

module.exports = {
    enviarMensagemTexto,
    enviarMensagemImagem,
    receberFotosGatos,
    receberFotosCachorros,
    receberFotosRaposas,
    receberFotosArte,
    emitirSom
};