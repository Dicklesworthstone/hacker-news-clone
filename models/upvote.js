'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Upvote extends Model {
    static associate(models) {
      Upvote.belongsTo(models.Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
      Upvote.belongsTo(models.Comment, { foreignKey: 'commentId', onDelete: 'CASCADE' });
      Upvote.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  Upvote.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Either postId or commentId will be set
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Either commentId or postId will be set
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    karma: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // This could represent the weight of the upvote
    },
  }, {
    sequelize,
    modelName: 'Upvote',
  });

  return Upvote;
};
