const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const usersRouter = require("./users");
const moviesRouter = require("./movies");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFound");

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required().min(2).max(30),
      password: Joi.string().required().min(2),
    }),
  }),
  login
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required().min(2).max(30),
      password: Joi.string().required().min(2),
    }),
  }),
  createUser
);

router.use("/users", auth, usersRouter);
router.use("/movies", auth, moviesRouter);
router.use("*", (req, res, next) => {
  next(new NotFoundError("Несуществующий адрес"));
});

module.exports = router;
