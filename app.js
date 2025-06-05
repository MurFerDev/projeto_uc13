const express = require('express');
const app = express();
const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    port: 3306,
    database: 'ecommerce_pc'
});

conexao.connect(function(erro) {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados: ' + erro.stack);
        return;
    }
    console.log('Conexão com banco de dados estabelecida com sucesso!');
});

app.get('/', function(req, res) {
    res.write('Hello, Senac!');
    res.end();
    });

app.listen(8080);