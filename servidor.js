const http = require("http");
const fs = require("fs");
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'word3_3000'
});

http.createServer(
    function (req, res) {
        if (req.url === "/") {
            fs.readFile("main.html", function(erro, data) {
                if (erro) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end("404 Not Found");
                    return;
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        } else if (req.url === '/dados' && req.method === 'GET') {
            connection.query('SELECT * FROM `frases` limit 10', (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Erro no banco de dados' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                }
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end("404 Not Found");
        }
    }
).listen(3000, () => {
    console.log("Servidor rodando na porta: http://localhost:3000");
});