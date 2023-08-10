const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://username:ps@cluster0.oxhvxoo.mongodb.net/node-phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model("Person", personSchema);

const app = express();
app.use(express.static("build"));
app.use(express.json());
// app.use(requestLogger); //request.body is undefined
app.use(cors());
app.use(
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

app.get("/", (request, response) => {
  response.send("<h1>hello<h1/>");
});

app.get("/info", (request, response) => {
  const personLength = Person.length;
  response.send(
    `Phonebook has info for ${personLength} people <br/> ${new Date()}`
  );
});
app.get("/persons", (request, response) => {
  Person.find({}).then((result) => {
    console.dir(result);
    // result.forEach((person) => console.log(person));
    response.json(result);
  });
});
app.get("/persons/:id", (request, response, next) => {
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
    .catch((error) => {
      next(error);
      // console.log(error);
      // response.status(400).send({ error: "malformatted id" });
    });
});
app.delete("/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
app.post("/persons", (request, response) => {
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

app.put("/persons/:id", (request, response, next) => {
  let body = request.body;
  const updatePerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, updatePerson, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// handler of requests with unknown endpoint
app.use(unknownEndpoint);

app.use((request, response, next) => {
  response.status(404).send("<h1>No routes found for this request</h1>");
});

app.use(express.json());
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("server listening on 3001");
});
