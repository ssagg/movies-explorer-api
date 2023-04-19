const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const userSchema = require('../models/user');
const ValidationError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');
const UnauthorizedError = require('../errors/Unauthorized');
const { JWT_SECRET } = require('../config');
const {
  INVALID_USER_DATA, USER_ALREADY_EXISTS, USER_NOT_FOUND, INVALID_USER_PASSWORD,
} = require('../errors/Errors');

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      name,
      email,
      password: hash,
    });
    const { _id } = user;
    res.send({
      _id,
      name,
      email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(
        new ValidationError(INVALID_USER_DATA),
      );
    } else if (err.code === 11000) {
      next(new ConflictError(USER_ALREADY_EXISTS));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(USER_NOT_FOUND);
    }
    const uncrypt = await bcrypt.compare(password, user.password);
    if (!uncrypt) {
      throw new UnauthorizedError(INVALID_USER_PASSWORD);
    }
    const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.send({ jwt });
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const response = await userSchema.findById(req.user._id);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const response = await userSchema.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
      },
      { new: true, runValidators: true },
    );
    res.send(response);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(INVALID_USER_DATA));
    } else if (err.code === 11000) {
      next(new ConflictError(USER_ALREADY_EXISTS));
    } else {
      next(err);
    }
  }
};
