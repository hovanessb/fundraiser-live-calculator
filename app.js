const path = require("node:path");
const http = require("node:http");
const express = require("express");
const { Server } = require("socket.io");

const hostname = "localhost";
const port = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// for favicon
app.get("/favicon.ico", (req, res) => {
	res.sendStatus(204);
});

// for serving static file, by-default user don't have access
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
	res.status(200).sendFile(path.join(__dirname, "/index.html"));
});

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

io.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		console.log("message: " + msg);
	});
});

io.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

/*
    socket.io doesn't work with app express middleware
    WORKS with node http server
    
app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
*/
