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

function findTodoIndex(todos, id) {
  return todos.findIndex((todo) => todo.id === id);
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
  response.json(request.user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const todo = {
    id: uuidv4(),
    title: request.body.title,
    done: false,
    deadline: new Date(request.body.deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);
  response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {
    user: { todos },
  } = request;
  const todoIndex = findTodoIndex(todos, request.params.id);
  if (todoIndex < 0) response.status(404).json({ error: "not found" });
  const updatedTodo = {
    ...todos[todoIndex],
    ...request.body,
  };
  todos.splice(todoIndex, 1, updatedTodo);
  response.json(todos[todoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {
    user: { todos },
  } = request;
  const todoIndex = findTodoIndex(todos, request.params.id);
  if (todoIndex < 0) response.status(404).json({ error: "not found" });
  const todoUpdated = {
    ...todos[todoIndex],
    done: !todos[todoIndex].done,
  };
  todos.splice(todoIndex, 1, todoUpdated);
  response.json(todos[todoIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;