const Filter = ({ filter, display }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={display} />{" "}
    </div>
  );
};

export default Filter;
