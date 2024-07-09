const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql2');
const random_name = require('node-random-name');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'fullcycle'
};

app.get('/', (_req, res) => {
  InsertName(res);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

async function getName() {
  return random_name({ random: Math.random});
}

async function InsertName(res) {
  const name = await getName();
  const connection = mysql.createConnection(dbConfig);
  const INSERT_QUERY = `INSERT INTO people(name) values('${name}')`;

  connection.query(INSERT_QUERY, (error, _results, _fields) => {
    if (error) {
      console.log(`Erro ao inserir registro: ${error}`);
      res.status(500).send('Erro ao inserir registro');
      return;
    }
    getAll(res, connection);
  });
}

function getAll(res, connection) {
  const SELECT_QUERY = `SELECT id, name FROM people`;

  connection.query(SELECT_QUERY, (error, results) => {
    if (error) {
      console.log(`Erro ao consultar registro: ${error}`);
      res.status(500).send('Erro ao consultar registro');
      return;
    }

    const tableRows = results
      .map(
        (person) => `
        <tr>
          <td>${person.id}</td>
          <td>${person.name}</td>
        </tr>
      `
      )
      .join('');
    const table = `
      <table>
        <tr>
          <th>#</th>
          <th>Nome</th>
        </tr>${tableRows}
      </table>`;

    res.send(`
      <h1>Full Cycle Rocks!</h1>
      ${table}
    `);

    connection.end();
  });
}
