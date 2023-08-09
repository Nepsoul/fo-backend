const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

//password should be hardcorded
const url = `mongodb+srv://mangoose:${password}@cluster0.oxhvxoo.mongodb.net/node-phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

if (process.argv.length > 3) {
  const personSchema = new mongoose.Schema({
    name: String,
    // number: Number,
    number: String, // number with charater
  });

  const Person = mongoose.model("Person", personSchema);

  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });
      person.save();
      // const person = new Person({
      //   name: "jason",
      //   number: 9607065476,
      // });

      const persons = Person.find({});
      return persons;
    })
    .then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      console.log("person data saved!");
      mongoose.connection.close();
    })
    .catch((error) => console.log(error, "catch error"));
}

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });

// person.save().then((result) => {
//   console.log("person data saved!");
//   mongoose.connection.close();
// });
