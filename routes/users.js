const { celebrate, Joi, errors } = require('celebrate');
const router = require('express').Router();
const { updateUser, getCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

router.use(errors());
module.exports = router;
