'use strict';

const fs = require('fs');
const path = require('path');
const { sequelize, Sequelize } = require('./models');
const { User, Post, Comment, Category, Tag, Job, Upvote } = require('./models');

// Helper function to load JSON data with detailed error reporting
const loadJson = (filename) => {
  const filePath = path.join(__dirname, './fake_data', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing JSON in file: ${filename}`);
    console.error(`Error details: ${error.message}`);
    throw error;
  }
};

// Function to escape special characters
const escapeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\"+char; // Prepends a backslash to backslash, percent,
                          // and double/single quotes
      default:
        return char;
    }
  });
};

// Function to handle insertion with unique constraint checks
const findOrCreateItem = async (Model, where, defaults) => {
  try {
    return await Model.findOrCreate({
      where,
      defaults,
    });
  } catch (error) {
    console.error(`Error in findOrCreateItem for model ${Model.name}:`, error.message);
    throw error;
  }
};

// Load all data files with validation and logging
const validateAndLoadJson = (filename, requiredFields = []) => {
  const data = loadJson(filename);
  return data.map(item => {
    const isValid = requiredFields.every(field => {
      const value = item[field];
      return typeof value === 'string' ? value.trim() : value !== undefined && value !== null;
    });
    if (!isValid) {
      console.error(`Skipping invalid entry in ${filename}:`, item);
      return null;
    }
    return item;
  }).filter(Boolean);  // Remove null entries from the array
};

const usersData = validateAndLoadJson('users.json', ['username']);
const postsData = validateAndLoadJson('posts.json', ['title', 'authorId', 'category', 'content']);
const commentsData = validateAndLoadJson('comments.json', ['content', 'postTitle', 'username']);
const categoriesData = validateAndLoadJson('categories.json', ['name']).map(category => ({
  ...category,
  slug: escapeString(category.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
}));
const tagsData = validateAndLoadJson('tags.json', ['name']).map(tag => ({
  ...tag,
  name: escapeString(tag.name),
}));
const jobsData = validateAndLoadJson('jobs.json', ['title']);
const upvotesData = validateAndLoadJson('upvotes.json', ['postId', 'commentId']);

const insertData = async () => {
  try {
    await sequelize.sync({ force: true }); // Drop and recreate tables

    // Insert Users with unique check
    for (const userData of usersData) {
      await findOrCreateItem(User, { username: userData.username }, userData);
    }

    // Insert Categories with unique check
    for (const categoryData of categoriesData) {
      await findOrCreateItem(Category, { name: categoryData.name }, categoryData);
    }

    // Insert Tags with unique check and validation
    for (const tagData of tagsData) {
      console.log('Processing tag:', tagData.name);  // Debugging log
      await findOrCreateItem(Tag, { name: tagData.name }, tagData);
    }

    // Insert Posts with validated category and authorId associations, and unique checks
    for (const postData of postsData) {
      // Validate the author exists
      const author = await User.findByPk(postData.authorId);
      if (!author) {
        console.error(`User not found for post: ${postData.title}, authorId: ${postData.authorId}`);
        continue; // Skip this post if the author does not exist
      }

      // Validate the category exists
      const category = await Category.findOne({ where: { name: postData.category } });
      if (!category) {
        console.error(`Category not found for post: ${postData.title}`);
        continue;
      }

      // Insert the post
      const post = await findOrCreateItem(Post, { title: postData.title }, {
        ...postData,
        authorId: author.id,  // Use the validated authorId
        categoryId: category.id,
      });

      // Associate Posts with Tags
      const postTags = await Tag.findAll({
        where: {
          name: {
            [Sequelize.Op.in]: postData.tags.filter(tag => tag && tag.trim()),
          },
        },
      });
      if (postTags.length !== postData.tags.length) {
        console.error(`Mismatch in tags for post: ${postData.title}`);
      }
      await post[0].addTags(postTags); // Using Sequelize's association method
    }

    // Insert Comments with validated postId and userId associations
    for (const commentData of commentsData) {
      const post = await Post.findOne({ where: { title: commentData.postTitle } });
      const user = await User.findOne({ where: { username: commentData.username } });
      if (!post || !user) {
        console.error(`Post or User not found for comment: ${commentData.content}`);
        continue;
      }
      await findOrCreateItem(Comment, {
        content: commentData.content,
        postId: post.id,
        userId: user.id,
      }, {
        ...commentData,
        postId: post.id,
        userId: user.id,
      });
    }

    // Insert Jobs with unique check
    for (const jobData of jobsData) {
      await findOrCreateItem(Job, { title: jobData.title }, jobData);
    }

    // Insert Upvotes and calculate total upvotes for posts and comments
    const upvoteMap = {};

    for (const upvote of upvotesData) {
      await Upvote.create(upvote);
      const key = upvote.postId ? `post-${upvote.postId}` : `comment-${upvote.commentId}`;
      if (!upvoteMap[key]) upvoteMap[key] = 0;
      upvoteMap[key] += 1;
    }

    // Update Posts and Comments with total upvotes
    for (const [key, value] of Object.entries(upvoteMap)) {
      const [type, id] = key.split('-');
      if (type === 'post') {
        await Post.update({ upvotes: value }, { where: { id } });
      } else if (type === 'comment') {
        await Comment.update({ upvotes: value }, { where: { id } });
      }
    }

    console.log('Data successfully loaded into the database.');
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    await sequelize.close();
  }
};

// Execute the data insertion script
insertData();
