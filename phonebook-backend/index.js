const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://mangoose:@cluster0.oxhvxoo.mongodb.net/node-phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

const App = express();
App.use(express.json());
App.use(express.static("build"));
App.use(cors());
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

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

let person = [];

App.get("/", (request, response) => {
  response.send("<h1>hello<h1/>");
});

App.get("/info", (request, response) => {
  const personLength = Person.length;
  response.send(
    `Phonebook has info for ${personLength} people <br/> ${new Date()}`
  );
});
App.get("/persons", (request, response) => {
  Person.find({}).then((result) => {
    console.dir(result);
    // result.forEach((person) => console.log(person));
    response.json(result);
  });
});
App.get("/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({
          error: 404,
          message: `there is no person with id ${request.params.id}`,
        });
      }
    })
    .catch((error) => console.log(error));
});
App.delete("/persons/:id", (request, response) => {
  const currentId = Number(request.params.id);
  Person = Person.filter((person) => person.id !== currentId);
  response.status(204).end();
});
App.post("/persons", (request, response) => {
  const newData = request.body;

  // newData.id = Math.floor(Math.random() * Persons.length + 1000000000000000);
  // let existedData = Person.find((person) => {
  //   return person.name === newData.name;
  // });
  // console.log(newData, "newdata");

  // if (existedData) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }
  // if (
  //   newData.name === "" ||
  //   newData.number === "" ||
  //   !newData.hasOwnProperty("name") ||
  //   !newData.hasOwnProperty("number")
  // ) {
  //   return response.status(400).json({ error: "name or number is missing" });
  // }

  if (newData.name === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: newData.name,
    number: newData.number,
  });

  person.save().then((result) => {
    response.json(result);
  });
  // persons.push(newData);

  // response.status(201).json(newData);
});

const PORT = process.env.PORT || 3001;
App.listen(PORT, () => {
  console.log("server listening on 3001");
});
