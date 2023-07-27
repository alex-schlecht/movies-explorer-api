const PageNotFoundError = require('../errors/PageNotFound');

module.exports.PageNotFound = (req, res, next) => next(new PageNotFoundError('Страница не найдена'));
