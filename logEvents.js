//npm modules
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

//Core modules
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dataTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dataTime} \t ${uuid()} \t ${message}`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", "log", logName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;
