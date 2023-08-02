const Notification = ({ message, colorChange }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      className={
        colorChange === "update"
          ? "update"
          : colorChange === "error"
          ? "error"
          : "Delete"
      }
    >
      {message}
    </div>
  );
};
export default Notification;
