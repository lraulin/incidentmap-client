module.exports = require("@stamp/it")({
  init(_, { stamp }) {
    // this will reuse the stamp name "FileStore" we set above
    this.log = require("bunyan").createLogger({ name: stamp.name });
  }
});
