'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
      Post.hasMany(models.Comment, { foreignKey: 'postId' });
      Post.hasMany(models.Upvote, { foreignKey: 'postId' });
    }
  }

  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    flags: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tags: DataTypes.STRING,
    category: {
      type: DataTypes.ENUM('Show HN', 'Ask HN', 'Job', 'General'),
      defaultValue: 'General',
    },
  }, {
    sequelize,
    modelName: 'Post',
  });

  return Post;
};
