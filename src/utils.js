const camelSpace = text => text.replace(/([a-z])([A-Z])/g, "$1 $2");

const capitalize = word => word[0].toUpperCase() + word.slice(1);

export const camelToTitle = text =>
  camelSpace(text)
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");
