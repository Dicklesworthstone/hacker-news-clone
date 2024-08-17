'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'authorId', as: 'posts' });
      User.hasMany(models.Comment, { foreignKey: 'authorId', as: 'comments' });
      User.hasMany(models.Upvote, { foreignKey: 'userId' });
      User.hasMany(models.Message, { as: 'sentMessages', foreignKey: 'senderId' });
      User.hasMany(models.Message, { as: 'receivedMessages', foreignKey: 'receiverId' });
      User.hasMany(models.Notification, { foreignKey: 'userId' });
      User.hasMany(models.Flag, { foreignKey: 'userId' });
      User.hasMany(models.Session, { foreignKey: 'userId' });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    karma: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};