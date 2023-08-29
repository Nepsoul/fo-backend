import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Person";
//import axios from "axios";
import UpdateService from "./Services/Update";
import Notification from "./components/Notification";

const App = () => {
  /* =>we need to get data from server
   =>thing to do
  1. backend server: will create fake backend server 
    -(=>for this npm i -D json-server =>"back-server": "json-server --port 3001 --watch db.json"(in .jason),)
     
  2. in frontend code,read the data from backend server
   2.1 npm library that provides technology to call backend server
   2.2 where and how to call this library from react code
  */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [number, setNum] = useState("");
  const [seaRch, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [colorChange, setColor] = useState("");
  useEffect(() => {
    UpdateService.getAll()
      .then((response) => {
        setPersons(response.data);
      })

      .catch((error) => console.log("this is failure message", error));
  }, []);

  const addnewName = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);

    let personExist = persons.find((person) => person.name === newName);
    //some() gives boolean value & in this case find() it returns object with all values.
    //console.log("this is person", personExist); //=> it used in when name added, num updated, deletion

    if (personExist) {
      let conFirm = window.confirm(
        newName +
          " is already added to phonebook,replace the old number with a new one?"
      );
      if (conFirm) {
        console.log("update");
        personExist.number = number;

        console.log(personExist);
        console.log(personExist.id);

        let updatePromise = UpdateService.update(personExist.id, personExist);
        console.log(updatePromise);
        updatePromise
          .then((response) => {
            setPersons(
              persons.map((x) => {
                if (x.name === newName) {
                  return { ...x, updatedNum: number };
                } else return x;
              })
            );
            console.log("hello");
            setErrorMessage(`Updated the number for ${personExist.name}`);
            setColor("update");
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${personExist.name} has already been removed from server`
            );
            setColor("error");
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: number,
        //id: persons.length + 1,
      };
      UpdateService.create(newPerson)
        .then((response) => {
          setPersons([...persons, response.data]);
          setErrorMessage("Added: " + newPerson.name);
          setColor("update");
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch((error) => {
          //displaying validation error msg returned by mongoose
          console.log("error");
          console.dir(error);
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };
  //console.log(persons[0].name);

  const handleNameChange = (event) => {
    //console.log(event.target.value);
    //console.log(event.target);
    setNewName(event.target.value);
  };
  const handlenumChange = (e) => {
    setNum(e.target.value);
  };

  const handleSearchName = (e) => {
    setSearch(e.target.value);
  };

  let newSearch = persons.filter((x) =>
    //in this line code is resolved from lt. to rt. i.e. from x.name
    //in here x(array).name(key obj) this resolves and lowercase method make to lower the string and then include method used
    //.toLowercase() => to make case sensitive

    //after connection to the database this sensitive case make the app crash because in database we have posted numbers only
    // and persons filtering using name field, while searching from database then at the start if find the numner in data base, number and name string doesn't 
    //match that's why crashed app, so for soln empty the database 
    x.name.toLowerCase().includes(seaRch.toLowerCase())
  );


  let showPersons = seaRch === "" ? persons : newSearch; //ternery method

  return (
    <>
      <h1>Phonebook used build</h1>

      <h1>
        {" "}
        <Notification message={errorMessage} colorChange={colorChange} />
      </h1>

      <div>
        {" "}
        <Filter filter={seaRch} display={handleSearchName} />
        {/* filter shown with <input value={seaRch} onChange={handleSearchName} /> */}
      </div>

      <PersonForm
        adNwNm={addnewName}
        value={newName}
        onChange={handleNameChange}
        valueNum={number}
        onChangeNum={handlenumChange}
      />

      <h1>Numbers</h1>

      <Person
        showPersons={showPersons}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage}
        setColor={setColor}
      />
    </>
  );
};

export default App;
