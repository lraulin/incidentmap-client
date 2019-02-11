const { createLogger, transports, format } = require("winston");
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" })
  ],
  // Enable exception handling when you create your logger.
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })]
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(new transports.File({ filename: "exceptions.log" }));

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple()
    })
  );
}

module.exports = logger;
