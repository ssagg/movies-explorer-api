const { celebrate, Joi, errors } = require("celebrate");
const router = require("express").Router();
const link = require("../utils/regexPattern");
const { getCards, createCard, removeCard } = require("../controllers/movies");

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required(),
      year: Joi.string().required().min(2).max(30),
      description: Joi.string().required().min(2).max(30),
      image: Joi.string().required().pattern(link),
      trailerLink: Joi.string().required().pattern(link),
      nameRU: Joi.string().required().min(2).max(30),
      nameEN: Joi.string().required().min(2).max(30),
      thumbnail: Joi.string().required().pattern(link),
      movieId: Joi.string().required().min(2).max(30),
    }),
  }),
  createCard
);
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  removeCard
);

router.use(errors());

module.exports = router;
