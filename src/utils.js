const camelSpace = text => text.replace(/([a-z])([A-Z])/g, "$1 $2");

const capitalize = word => word[0].toUpperCase() + word.slice(1);

export const camelToTitle = text =>
  camelSpace(text)
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");

export const formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${month}/${day}/${year}`;
};
