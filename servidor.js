const http = require("http");
const fs = require("fs");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "word3_3000"
});

connection.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado ao banco de dados");
});

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        fs.readFile("main.html", (erro, data) => {
            if (erro) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("404 Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (req.url === "/dados" && req.method === "GET") {
        connection.query("SELECT * FROM `frases` LIMIT 10", (error, results) => {
            if (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Erro no banco de dados" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
    }
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});