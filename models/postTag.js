'use strict';

module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id',
      },
      allowNull: false,
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tag',
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['postId', 'tagId']
      },
      {
        fields: ['postId']
      },
      {
        fields: ['tagId']
      }
    ],
  });

  return PostTag;
};
