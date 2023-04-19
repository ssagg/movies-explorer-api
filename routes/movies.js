const { celebrate, Joi, errors } = require('celebrate');
const router = require('express').Router();
const { link, imageLink } = require('../utils/regexPattern');
const { getMovies, createMovie, removeMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(imageLink),
      trailerLink: Joi.string().required().pattern(link),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(imageLink),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  removeMovie,
);

router.use(errors());

module.exports = router;
