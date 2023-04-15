const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const { errorsLogger } = require("./middlewares/logger");
const error = require("./middlewares/error");
const router = require("./routes/index");
const { requestsLogger } = require("./middlewares/logger");
const { PORT, DB } = require("./config");
const limiterConfig = require("./utils/limiterConfig");

const app = express();
const limiter = rateLimit(
  limiterConfig
  //   {
  //   windowMs: 150 * 60 * 1000,
  //   max: 100,
  //   standardHeaders: true,
  //   legacyHeaders: false,
  // }
);

app.use(limiter);
app.use(helmet());
// app.use(cors({ origin: ['https://mesto.ssagg.nomoredomains.work', 'http://mesto.ssagg.nomoredomains.work'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB, {
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(requestsLogger);
app.use("/", router);
app.use(errorsLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App port:${PORT}`);
});
