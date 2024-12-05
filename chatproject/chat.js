const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
require('dotenv').config();
const { receberFotosGatos, receberFotosCachorros, 
	receberFotosRaposas, receberFotosArte, enviarMensagemTexto, 
	enviarMensagemImagem, emitirSom } = require('./services/interactorService');

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
	console.error("Erro: API key da OpenAI não encontrada.");
	process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

io.on("connection", (socket) => {
	console.log("Usuário conectado: " + socket.id);
	
	// Lida com mensagens enviadas por usuários
	socket.on("message", async (msg) => {
		// ChatGPT texto
		if (msg.message.startsWith('/text')) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const userMessage = msg.message.replace('/text', '').trim();
			const response = await enviarMensagemTexto(userMessage);
			io.emit("message", { id: socket.id, username: "ChatGPT", message: response });
		}
		// ChatGPT imagens
		 else if (msg.message.startsWith('/image')) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const imageDescription = msg.message.replace('/image', '').trim();
			const imageUrl = await enviarMensagemImagem(imageDescription);
			io.emit("image", { id: socket.id, username: "ChatGPT", imageUrl: imageUrl });
		}
		// Api de gatos 
		else if(msg.message.includes("gato")) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const imageUrl = await receberFotosGatos();
			console.log("imageUrl - " + imageUrl);
			io.emit("image", { id: socket.id, username: "Gatinho:", imageUrl: imageUrl})
		} 
		// Api de cachorros
		else if(msg.message.includes("cachorro")) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const imageUrl = await receberFotosCachorros();
			io.emit("image", { id: socket.id, username: "Gatinho:", imageUrl: imageUrl})
		}
		// Api de raposas
		else if(msg.message.includes("raposa")) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const imageUrl = await receberFotosRaposas();
			io.emit("image", { id: socket.id, username: "Gatinho:", imageUrl: imageUrl})
		}
		// Api de arte
		else if(msg.message.includes("arte")) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const imageUrl = await receberFotosArte();
			io.emit("image", { id: socket.id, username: "Gatinho:", imageUrl: imageUrl})
		}
		// Api emissão de sons
		else if (msg.message.startsWith("/som")) {
			await io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
			const tipoSom = msg.message.replace("/som", "").trim();
			const soundUrl = await emitirSom(tipoSom);
			io.emit("sound", { id: socket.id, username: msg.username, soundUrl: soundUrl });
		}
		 else {
			io.emit("message", { id: socket.id, username: msg.username, message: msg.message });
		}
	});
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/chat-login.html");
});

app.get("/chat", (req, res) => {
	const username = req.query.user || "Guest";
	let chat = fs.readFileSync("./chatproject/chat-home.html").toString();
	chat = chat.replace("user-chat", username);
	res.end(chat);
});


server.listen(4000, () => {
	console.log("Servidor rodando na porta 4000");
});
