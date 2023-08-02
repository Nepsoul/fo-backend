import UpdateService from "../Services/Update";

const Person = ({ showPersons, setPersons, setErrorMessage, setColor }) => {
  const deletedPerson = (id) => {
    UpdateService.del(id).then((response) => {
      let filteredPerson = showPersons.filter((person) => person.id !== id);

      setPersons(filteredPerson);
      setErrorMessage("Deleted");
      setColor("Delete");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    });
  };
  return (
    <>
      {/* for fronted data we used x.name and x.numbers but for backend server 
    used x.name and x.number coz its declared value is noted as number */}
      {showPersons.map((x) => (
        <li key={x.id}>
          {x.name} {x.number}{" "}
          <button
            onClick={() => {
              let confirmation = window.confirm(`Delete ${x.name}?`);
              if (confirmation === false) {
              } else {
                deletedPerson(x.id);
              }
            }}
          >
            delete
          </button>
        </li>
      ))}
    </>
  );
};
export default Person;
