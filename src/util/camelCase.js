const camelCase = str => {
  str = str.toLowerCase();
  const words = str.split(" ");
  return words
    .map((x, i) => (i > 0 ? x[0].toUpperCase() + x.slice(1) : x))
    .join("");
};

export default camelCase();
