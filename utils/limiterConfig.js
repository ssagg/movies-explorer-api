const limiterConfig = {
  windowMs: 150 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
};

module.exports = limiterConfig;
