const cardSchema = require("../models/movie");
const NotFoundError = require("../errors/NotFound");
const NotAuthorized = require("../errors/Forbidden");
const ValidationError = require("../errors/BadRequest");

module.exports.createCard = async (req, res, next) => {
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
    let resp = await cardSchema.create({
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
    resp = await resp.populate("owner");
    res.send(resp);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(
        new ValidationError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    } else {
      next(err);
    }
  }
};

module.exports.getCards = (req, res, next) => {
  console.log(req.user._id);
  cardSchema
    .find({ owner: req.user._id })
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

module.exports.removeCard = (req, res, next) => {
  const removeCard = () =>
    cardSchema
      .findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);

  cardSchema
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError("Такой карточки не существует");
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return removeCard();
      }
      throw new NotAuthorized("Нельзя удалять чужие фильмы");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Переданы некорректные данные карточки"));
      } else {
        next(err);
      }
    });
};
