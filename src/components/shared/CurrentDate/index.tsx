const CurrentDate = () => {
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
  return (
    <div>{date}</div>
  );
};

export default CurrentDate;
