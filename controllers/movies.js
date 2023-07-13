const Movie = require('../models/movie');
const { errorHandler } = require('../utils/errorHandler');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate('owner')
    .then((movieAll) => res.send(movieAll))
    .catch((err) => errorHandler(err, res, next));
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU, nameEN } = req.body;
  const userId = req.user._Id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: userId,
  })
  .then((movie) => movie.populate('owner'))
  .then((movie) => res.status(201).send(movie))
  .catch((err) => errorHandler(err, res, next));
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const deleteMovie = (_id) => Movie.findOneAndDelete(_id);
  Movie.findById({ _id: id })
  .orFail()
  .then((movie) => {
    if (movie.owner._id.valueOf() !== userId) {
      return next(new Forbidden('Доступ запрещен'));
    }
    return deleteMovie(movie._id)
      .then((deleteMovie) => res.send(deleteMovie));
  })
  .catch((err) => errorHandler(err, res, next));
};
