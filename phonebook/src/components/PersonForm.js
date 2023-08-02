const PersonForm = (props) => {
  return (
    <>
      <h1>Add a new</h1>
      <form onSubmit={props.adNwNm}>
        <div>
          name:
          <input value={props.value} onChange={props.onChange} />
          <br />
          number: <input value={props.valueNum} onChange={props.onChangeNum} />
        </div>

        <div>
          <button type="submit">add</button>{" "}
        </div>
      </form>
    </>
  );
};
export default PersonForm;
