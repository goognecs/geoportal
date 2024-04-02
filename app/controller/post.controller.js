const { Op } = require("sequelize");
const db = require("../model/mode")
const Post = db.post
const Comment = db.comment
const { validationResult, matchedData } = require('express-validator');
const { POST } = require("../config/constant");

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  const pagination = { totalItems, totalPages, currentPage }
  return { posts, pagination };
};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.postView = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: ['user', { model: db.comment, include: ['user'], as: 'comments' }]
    })

    res.render('posts/post', { post, title: `Geoportal | ${post.title.substring(0, 10)}` })
    return

  } catch (error) {
      res.redirect('/geoportal')
  }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.postStore = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.send({ errors: result.mapped() });
  }

  let data = matchedData(req)

  const image = req.file ? req.file.path.replace('public', '').trim() : null

  console.log(image)

  //convert tags to array
  data.tags = data.tags.split(',').map(tag => tag.trim())
  await Post.create({ ...data, userId: req.session.user.id, image })

  res.redirect('/geoportal')
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.postSearch = async (req, res) => {
  const result = validationResult(req);
  let { search_query, constraint } = matchedData(req)

  if (!result.isEmpty()) {
    res.render('posts/post_result', { posts: [], search_query, constraint, title: 'Geoportal | Search' })
    return
  }

  let condition = null

  if(search_query == '') {
    const page = req.query.page
    const { limit, offset } = getPagination(page, POST.SEARCH_LIMIT);

    const data = await Post.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: ['user', { model: db.comment, include: ['user'], as: 'comments' }]
    })
    
    const { posts, pagination } = getPagingData(data, page, limit)
  
    res.render('posts/post_result', { posts, search_query, constraint, pagination, title: 'Geoportal | Search' })
    return
  }
  
  if (constraint === 'tags') {
    const contains = []
    const tags = search_query.split(',').map(tag => tag.trim())

    for (let tag of tags) {
      contains.push({
        [Op.contains]: [tag],
      });
    }

    condition = { [Op.or]: contains }
  }
  else {
    condition = { [Op.iLike]: `%${search_query}%` }
  }


  const page = req.query.page
  const { limit, offset } = getPagination(page, POST.SEARCH_LIMIT);
  const data = await Post.findAndCountAll({
    where: { [constraint]: condition },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    include: ['user', { model: db.comment, include: ['user'], as: 'comments' }]
  })
  const { posts, pagination } = getPagingData(data, page, limit)

  res.render('posts/post_result', { posts, search_query, constraint, pagination, title: 'Geoportal | Search' })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.postList = async (req, res) => {
  const page = req.query.page
  const { limit, offset } = getPagination(page, 10);
  const data = await Post.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    include: ['user', { model: db.comment, include: ['user'], as: 'comments' }]
  })
  const { posts, pagination } = getPagingData(data, page, limit)
  res.render('posts/post_list', { posts, pagination })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.postCreateComment = async (req, res) => {
  const content = req.body.content
  const image = req.body.image
  const postId = req.body.postId

  console.log(req.body)

  const { id } = await Comment.create({ content, image, userId: req.session.user.id, postId })
  const comment = await Comment.findByPk(id, {
    include: ['user'],
    order: [['createdAt', 'DESC']],
  })

  return res.render('posts/post_comment', { comment })
}

