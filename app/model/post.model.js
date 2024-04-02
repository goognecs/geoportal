const { Sequelize, DataTypes } = require("sequelize");

/**
 * 
 * @param {Sequelize} sequelize 
 * @param {DataTypes} Sequelize 
 */
module.exports = 

(sequelize, Sequelize) => {
  const Post = sequelize.define('post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING(255))
    },
    description: {
      type: Sequelize.TEXT(1000),
      allowNull: false
    },
    image: {
      type: Sequelize.STRING(),
      allowNull: true
    }
  })
  
  return Post
}