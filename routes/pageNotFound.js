const router = require('express').Router();
const { pageNotFound } = require('../controllers/pageNotFound');

router.all('*', notFound);

module.exports = router;
