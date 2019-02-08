const { createLogger, transports } = require("winston");

// Enable exception handling when you create your logger.
const logger = createLogger({
  transports: [new transports.File({ filename: "combined.log" })],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })]
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(new transports.File({ filename: "exceptions.log" }));

module.exports = logger;
