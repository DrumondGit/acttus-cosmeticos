// CONFIGURAÇÃO DO SERVIDOR / 

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

// Configura a conexão com o banco de dados
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "coxinha",
    database: "controleProducao",
});


// Inicializa a conexão com o banco de dados
connection.connect();

// testar a conexão
connection.query("SELECT 1+1 AS solution", (err, rows, fields) => {
    //Operação simples para testar o funcionamento
    if (err) throw err;

    console.log("The solution is: ", rows[0].solution);
});

app.use(cors({ origin: "*", }));

// INICIAR SERVIDOR NODE/

app.listen(3303, () => {
    console.log("Servidor inicializado!");
});

// ------------------------------------------------------------------------------------------------ //

// ROTAS 
// CADASTRO DE USUÁRIO
app.post("/cadastro", function (req, res) {
    connection.query(
      `INSERT INTO usuario VALUES(NULL,"${req.body.nome}","${req.body.senha}","${req.body.email}",0)`,
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro de cadastro",
            mensagem: err,
          });
        }
  
        connection.query(
          `SELECT * FROM usuario WHERE email = "${req.body.email}" AND senha = "${req.body.senha}"`,
          (err, rows, fields) => {
  
            if (err) {
              return res.json({
                tipo: "Erro de login",
                mensagem: err,
              });
            }
  
            return res.json({
              tipo: "Cadastro realizado com sucesso",
              mensagem: `Bem vindo ao nosso site, ${rows[0].nome}`,
              usuario: {
                id: rows[0].id,
                temPermissao: rows[0].temPermissao,
              },
            });
          }
        );
      }
    );
  });


// LOGIN
app.post("/login", function (req, res) {
  connection.query(
    `SELECT * FROM usuario WHERE email = "${req.body.email}" AND senha = "${req.body.senha}"`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Usuário não encontrado",
          mensagem: "Verifique os valores inseridos",
        });
      } else {
        return res.json({
          tipo: "Login realizado com sucesso",
          mensagem: `Bem vindo de volta, ${rows[0].nome}`,
          usuario: {
            id: rows[0].id,
            temPermissao: rows[0].temPermissao,
          },
        });
      }
    }
  );
});


// Pegar as origens do banco de dados para colocar no dropdown
app.get('/selectOrigem', function (req, res) {
  var arrayOrigem = [];

  connection.query('SELECT * FROM origem', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayOrigem.push({
          id: rows[i].id,
          nome: rows[i].nome,
        });
      }
    }
    res.send(JSON.stringify(arrayOrigem));
  })
});


//Função para pegar o ID da origem
app.get("/getIdOrigem", function (req, res){

  connection.query(
    `SELECT id from origem, where nome like ${req.body.nome}`,

    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      res.send(JSON.stringify(rows[0].id));
    }
  )

})

//Cadastro de matéria prima
app.post("/cadastraMateriaPrima", function (req, res) {

  connection.query(
    `INSERT INTO materiaPrima VALUES (NULL, "${req.body.nome}", "${req.body.INCI_nome}", "${req.body.estoque_atual}", "${req.body.estoque_min}", "${req.body.origemId}")`,

    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Matéria Prima cadastrado com sucesso!",
        mensagem: `Matéria Prima cadastrado com sucesso!`,
      });
    },
  );
});



app.post("/cadastrarProduto", function (req, res) {
  connection.query(
    `INSERT INTO produto VALUES(NULL,"${req.body.nome}","${req.body.lucro}")`,
    (err, rows, fields) => {
    
      if (err) {
        return res.json({
          tipo: "Erro ao cadastrar produto",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Cadastro produto",
        mensagem: `Produto cadastrado com sucesso!`,
      });
    }
  );
});


