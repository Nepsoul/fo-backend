const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mangoose:${password}@cluster0.oxhvxoo.mongodb.net/node-phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", noteSchema);

// const person = new Person({
//   name: "jason",
//   number: 9607065476,
// });

Person.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// person.save().then((result) => {
//   console.log("person data saved!");
//   mongoose.connection.close();
// });
