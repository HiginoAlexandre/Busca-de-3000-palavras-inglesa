const express = require("express");
const app = express();
const mysql = require("mysql2");
// Configuração do banco de dados
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "word3_3000"
});

connection.connect(err => {
    if (err) {
        console.log("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("✅ Conectado ao banco de dados");
});

app.use(express.static("public"));
app.get('/api/palavras', (req, res) => {
    const pagina = parseInt(req.query.pagina) || 0;
    const limite = parseInt(req.query.limite) || 1;
    const offset = pagina * limite;

    // Primeiro, pegamos o total de registros
    connection.query('SELECT COUNT(*) as total FROM `frases`', (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        
        const total = results[0].total;

        // Depois, buscamos os registros da página atual
        const query = `
            SELECT * FROM frases 
            LIMIT ? OFFSET ?
        `;

        connection.query(query, [limite, offset], (error, palavras) => {
            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }

            res.json({
                total: total,
                pagina: pagina,
                palavras: palavras
            });
        });
    });
});

app.listen(3000, ()=>{
    console.log("Servidor rodando em http://localhost:3000");
});

app.get("/dados", (req, res) => {
    connection.query("SELECT * FROM `frases` LIMIT 10", (error, results) => {
        if (error) {
            res.status(500).json({ error: "Erro no banco de dados" });
        } else {
            res.json(results);
        }
    });
});