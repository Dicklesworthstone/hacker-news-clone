'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
      Comment.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
      Comment.belongsTo(models.Comment, { as: 'parent', foreignKey: 'parentId', onDelete: 'CASCADE' });
      Comment.hasMany(models.Comment, { as: 'replies', foreignKey: 'parentId', onDelete: 'CASCADE' });
      Comment.hasMany(models.Flag, { foreignKey: 'commentId' });
    }
  }

  Comment.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // ParentId can be null for top-level comments
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,  // Markdown content is supported
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,  // Keep for caching purposes, but dynamically calculate as needed
    },
    flags: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};
