const { default: mongoose } = require("mongoose");
const nodeEnv = process.env.NODE_ENV;
const app = require("./src/app");
require("dotenv").config({
  path: `.env.${nodeEnv}`,
});
console.log("ENV:::", nodeEnv, " PORT:::", process.env.PORT);
const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(
    `------::----${process.env.SERVICE_NAME} start with port ${PORT}`
  );
});
// process.on('SIGINT', () => {
//     server.close(() => console.log(`EXIT SERVER EXPRESS`))
// })
