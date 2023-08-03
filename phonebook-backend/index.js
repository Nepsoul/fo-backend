const express = require("express");
const morgan = require("morgan");

const App = express();
App.use(express.json());
App.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

App.get("/", (request, response) => {
  response.send("<h1>hello<h1/>");
});

App.get("/info", (request, response) => {
  const personLength = persons.length;
  response.send(
    `Phonebook has info for ${personLength} people <br/> ${new Date()}`
  );
});

App.get("/persons", (request, response) => {
  response.json(persons);
});
App.get("/persons/:id", (request, response) => {
  const currentId = Number(request.params.id);
  const thisPerson = persons.find((person) => person.id === currentId);
  if (thisPerson) response.json(thisPerson);
  else
    response
      .status(404)
      .json({ error: 404, message: `there is no person with id` + currentId });
  // .end();
  console.log(thisPerson);
});
App.delete("/persons/:id", (request, response) => {
  const currentId = Number(request.params.id);
  persons = persons.filter((person) => person.id !== currentId);
  response.status(204).end();
});
App.post("/persons", (request, response) => {
  let newData = request.body;

  newData.id = Math.floor(Math.random() * persons.length + 1000000000000000);
  let existedData = persons.find((person) => {
    return person.name === newData.name;
  });
  console.log(newData, "newdata");

  if (existedData) {
    return response.status(400).json({ error: "name must be unique" });
  }
  if (
    newData.name === "" ||
    newData.number === "" ||
    !newData.hasOwnProperty("name") ||
    !newData.hasOwnProperty("number")
  ) {
    return response.status(400).json({ error: "name or number is missing" });
  }
  persons.push(newData);

  response.status(201).json(newData);
});

App.listen(3001, () => {
  console.log("server listening on 3001");
});
