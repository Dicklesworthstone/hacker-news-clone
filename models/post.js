'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
      Post.hasMany(models.Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
      Post.hasMany(models.Upvote, { foreignKey: 'postId', onDelete: 'CASCADE' });
      Post.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Post.belongsToMany(models.Tag, { through: 'PostTag', foreignKey: 'postId' });
      Post.hasMany(models.Flag, { foreignKey: 'postId' });
    }
  }

  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // Supports markdown content
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Cache value; dynamically calculated based on upvotes.json
    },
    flags: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Post',
  });

  return Post;
};
