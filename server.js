/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

require("dotenv").config();

process.on("uncaughtException", (err, origin) => {
  console.error(`Uncaught exception: ${err}\n${err.stack}\nOrigin: ${origin}`);
  console.log("Shutting down...");
  process.exit(1);
});

const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.DB.replace(/<password>/, process.env.DB_PASS))
  .then(() => console.log("DB connection established..."));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled rejection: ${promise}\n${reason.stack}\nReason: ${reason}`);
  console.log("Shutting down...");
  server.close(err => process.exit(1));
});
