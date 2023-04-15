require("dotenv").config();

const { JWT_SECRET = "JWT_SECRET" } = process.env;
const { PORT = "3000" } = process.env;
const { DB = "mongodb://localhost:27017/bitfilmsdb" } = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  DB,
};
