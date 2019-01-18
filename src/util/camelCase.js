export default function camelCase(str) {
  str = str.toLowerCase();
  const words = str.split(" ");
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  return words.join("");
}
