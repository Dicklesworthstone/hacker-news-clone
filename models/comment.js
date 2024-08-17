'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    postId: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    upvotes: DataTypes.INTEGER,
    flags: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};