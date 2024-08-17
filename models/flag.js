'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Flag extends Model {
    static associate(models) {
      Flag.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
      Flag.belongsTo(models.Post, { as: 'post', foreignKey: 'postId' });
      Flag.belongsTo(models.Comment, { as: 'comment', foreignKey: 'commentId' });
    }
  }

  Flag.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Flag',
  });

  return Flag;
};