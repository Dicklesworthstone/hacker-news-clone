'use strict';

const Sequelize = require('sequelize');
const path = require('path');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Explicitly import each model
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Post = require('./post')(sequelize, Sequelize.DataTypes);
const Comment = require('./comment')(sequelize, Sequelize.DataTypes);
const Upvote = require('./upvote')(sequelize, Sequelize.DataTypes);
const Job = require('./job')(sequelize, Sequelize.DataTypes);
const Tag = require('./tag')(sequelize, Sequelize.DataTypes);
const Flag = require('./flag')(sequelize, Sequelize.DataTypes);
const PostTag = require('./postTag')(sequelize, Sequelize.DataTypes);
const Category = require('./category')(sequelize, Sequelize.DataTypes);
const Message = require('./message')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification')(sequelize, Sequelize.DataTypes);
const Session = require('./session')(sequelize, Sequelize.DataTypes);

// Assign models to the db object
db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Upvote = Upvote;
db.Job = Job;
db.Tag = Tag;
db.Flag = Flag;
db.PostTag = PostTag;
db.Category = Category;
db.Message = Message;
db.Notification = Notification;
db.Session = Session;

// Setup associations for each model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
