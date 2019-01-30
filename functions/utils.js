const fs = require("fs");

module.exports = {
  writeToFile: (text, file) => {
    const stream = fs.createWriteStream(file, { flags: "a" });
    stream.write(text + "\n");
    stream.end();
  },
  readFile: (path, opts = "utf8") =>
    new Promise((res, rej) => {
      fs.readFile(path, opts, (err, data) => {
        if (err) rej(err);
        else res(data);
      });
    }),
  readJsonFile: async path => JSON.parse(await this.readFile(path))
};
