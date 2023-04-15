const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');
const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
