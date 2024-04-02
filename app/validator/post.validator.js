const { body, query } = require('express-validator');

exports.store = [
  body('title').isString().trim().notEmpty().isLength({ max: 255 }),
  body('tags').isString().trim().notEmpty().isLength({ max: 255 }),
  body('description').isString().trim().notEmpty(),
  body('image').optional().trim()
]

exports.search = [
  query('search_query').isString().trim(),
  query('constraint').isString().trim().notEmpty()
]
