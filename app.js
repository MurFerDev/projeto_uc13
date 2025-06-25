const express = require('express');
const app = express();
const {engine} = require('express-handlebars');

app.use(express.urlencoded({extended: true}));

const mysql = require('mysql2');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));
app.use('/static', express.static(__dirname + '/static'));


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

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

app.get('/clientes', (req, res) => {;
    let sql = 'SELECT * FROM clientes';
    conexao.query(sql, function(erro, clientes_qs) {
        if (erro) {
            console.error('Erro ao consultar clientes:', erro);
            res.status(500).send('Erro ao consultar clientes');
            return;
        }
        res.render('clientes', {clientes: clientes_qs});
    });
});

app.get('/', (req, res) => {;
    let sql = 'SELECT * FROM produtos';
    conexao.query(sql, function(erro, produtos_qs) {
        if (erro) {
            console.error('Erro ao consultar produtos:', erro);
            res.status(500).send('Erro ao consultar produtos');
            return;
        }
        res.render('index', {produtos: produtos_qs});
    });
});

app.get('/produtos/add', (req, res) => {
  let sql = 'SELECT id, nome FROM categorias';
  conexao.query(sql, function (erro, categorias_qs) {
    if (erro) {
      console.error('Erro ao consultar categorias:', erro);
      res.status(500).send('Erro ao consultar categorias');
      return;
    }
    res.render('produto_form', { categorias: categorias_qs });
  });
});
 
app.post('/produtos/add', (req, res) => {
    const {nome, descricao, preco, estoque, categoria_id} = req.body;
    
    const sql = `
    INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id)
    VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, descricao, preco, estoque, categoria_id], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao inserir produto:', erro);
            res.status(500).send('Erro ao adicionar produto');
            return;
        }
        console.log('Produto adicionado com sucesso!');
        res.redirect('/');
    });
});

app.get('/categoria/add', (req, res) => {
  res.render('categoria_form');
}); 

app.post('/categoria/add', (req, res) => {
    const {nome, descricao} = req.body;
    
    const sql = `
    INSERT INTO categorias (nome, descricao)
    VALUES (?, ?)
    `;

    conexao.query(sql, [nome, descricao], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao inserir categoria:', erro);
            res.status(500).send('Erro ao adicionar categoria');
            return;
        }
        console.log('Categoria adicionada com sucesso!');
        res.redirect('/categorias');
    });
});

app.get('/categorias', (req, res) => {
    let sql = 'SELECT * FROM categorias';
    conexao.query(sql, function(erro, categorias_qs) {
        if (erro) {
            console.error('Erro ao consultar categorias:', erro);
            res.status(500).send('Erro ao consultar categorias');
            return;
        }
        res.render('categorias', {categorias: categorias_qs});
    });
});

app.get('/produtos/:id/detalhes', (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT * FROM produtos WHERE id = ?';
    conexao.query(sql, [id], function(erro, produto_qs) {
        if (erro) {
            console.error('Erro ao consultar produto:', erro);
            res.status(500).send('Erro ao consultar produto');
            return;
        }
        if (produto_qs.length === 0) {
            return res.status(404).send('Produto não encontrado');
        }
        res.render('produto', {produto: produto_qs[0]});
    });
});

app.get('/produtos/categoria/categoria:id', (req, res) => {
    const categoria_id = req.params.id;

    let sql = `
        SELECT produtos.*, categorias.nome AS categoria_nome FROM produtos
        JOIN categorias ON produtos.categoria_id = categorias.id
        WHERE categorias.id = ?
        `;

        conexao.query(sql, [categoria_id], function(erro, produtos_qs) {
            if (erro) {
                console.error('Erro ao consultar produtos por categoria:', erro);
                res.status(500).send('Erro ao consultar produtos por categoria');
                return;
            }
        });

        conexao.query(sql, [categoria_id], (erro, produtos_qs) => {
            if (erro) {
                console.error('Erro ao consultar produtos por categoria:', erro);
                res.status(500).send('Erro ao consultar produtos por categoria');
                return;
            }
            res.render('produtos_categoria', {produtos: produtos_qs
            });
    });
});

app.post('/produtos/:id/remover', (req, res) => {
    const id = req.params.id;
    let sql = 'DELETE FROM produtos WHERE id = ?';
    conexao.query(sql, [id], function(erro, resultado) {
        if (erro) {
            console.error('Erro ao remover produto:', erro);
            return res.status(500).send('Erro ao remover produto');
        }
        console.log('Produto removido com sucesso!');
        res.redirect('/');
    });
});

app.get('/produto', (req, res) => {
    res.render('produto_form');
});

app.listen(8080);