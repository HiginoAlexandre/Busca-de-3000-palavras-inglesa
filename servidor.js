const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

// Conexão com o banco de dados
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

// Criando o servidor
const server = http.createServer((req, res) => {
    let filePath = req.url === "/" ? "public/main.html" : `public${req.url}`;
    let extname = path.extname(filePath);
    
    // Mapeamento de tipos MIME
    const contentTypeMap = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject"
    };

    // Se a requisição for para "/dados", retorna JSON do banco de dados
    if (req.url === "/dados" && req.method === "GET") {
        connection.query("SELECT * FROM `frases` LIMIT 10", (error, results) => {
            if (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Erro no banco de dados" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            }
        });
        return;
    }

    // Verifica se a extensão é suportada, se não, assume HTML por padrão
    let contentType = contentTypeMap[extname] || "text/html";

    // Lê o arquivo e envia a resposta
    fs.readFile(filePath, (erro, data) => {
        if (erro) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h1>404 - Arquivo não encontrado</h1>");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
});

// Inicia o servidor
server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
