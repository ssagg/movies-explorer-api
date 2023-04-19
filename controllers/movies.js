const movieSchema = require('../models/movie');
const NotFoundError = require('../errors/NotFound');
const NotAuthorized = require('../errors/Forbidden');
const ValidationError = require('../errors/BadRequest');
const { INVALID_FILM_DATA, FORBIDDEN_FILM_DELETE, FILM_NOT_FOUND } = require('../errors/Errors');

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    let resp = await movieSchema.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    resp = await resp.populate('owner');
    res.send(resp);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(
        new ValidationError(INVALID_FILM_DATA),
      );
    } else {
      next(err);
    }
  }
};

module.exports.getMovies = (req, res, next) => {
  movieSchema
    .find({ owner: req.user._id })
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

module.exports.removeMovie = (req, res, next) => {
  const removeCard = () => movieSchema.findByIdAndRemove(req.params.movieId)
    .then((card) => res.send(card))
    .catch(next);

  movieSchema
    .findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(FILM_NOT_FOUND);
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return removeCard();
      }
      throw new NotAuthorized(FORBIDDEN_FILM_DELETE);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(INVALID_FILM_DATA));
      } else {
        next(err);
      }
    });
};
