const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
};

export default formatDate;
