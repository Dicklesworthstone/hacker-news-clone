'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Upvote extends Model {
    static associate(models) {
      Upvote.belongsTo(models.Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
      Upvote.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  Upvote.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    karma: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Upvote',
  });

  return Upvote;
};