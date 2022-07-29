const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const [user] = findUser(username);
  if (!user) response.status(404).json({ error: "not found" });
  request.user = user;
  next();
}

function userExists(username) {
  return users.some((user) => user.username === username);
}

function findUser(username) {
  return users.filter((user) => user.username === username);
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const user = { id: uuidv4(), name, username, todos: [] };
  if (userExists(username)) {
    response.status(400).json({ error: "user already exists" });
  }
  users.push(user);
  response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;