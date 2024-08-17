import { Op, sequelize } from 'sequelize';
import nc from 'next-connect';
import db from '../../models';
const { Post, User, Upvote, Comment, Tag, Category, PostTag  } = db;
import serverLogger from '../../utils/server-logger';  // Corrected import path
import { getCachedData, setCachedData } from '../../utils/cache';

const GRAVITY = 1.8;
const EARLY_BOOST_THRESHOLD = 12; // Early boost applies within the first 12 hours

const handler = nc()
    .get(async (req, res) => {
        try {
            const { page = 1, sortBy, tag, category } = req.query;
            const limit = 10;
            const offset = (page - 1) * limit;

            // Generate a unique cache key based on the query parameters
            const cacheKey = `posts-${page}-${sortBy}-${tag}-${category}`;
            let posts = getCachedData(cacheKey);

            if (!posts) {
                const where = {};
                if (category) {
                    const categoryInstance = await Category.findOne({ where: { name: category } });
                    if (categoryInstance) {
                        where.categoryId = categoryInstance.id;
                    } else {
                        return res.status(404).json({ error: 'Category not found' });
                    }
                }

                if (tag) {
                    const tagInstance = await Tag.findOne({ where: { name: tag } });
                    if (tagInstance) {
                        where['$tags.id$'] = tagInstance.id;
                    } else {
                        return res.status(404).json({ error: 'Tag not found' });
                    }
                }

                posts = await Post.findAll({
                    where,
                    include: [
                        { model: User, as: 'author' },
                        {
                            model: Upvote,
                            include: [{ model: User, attributes: ['karma'] }]
                        },
                        {
                            model: Comment,
                            attributes: [
                                [sequelize.fn('COUNT', sequelize.col('comments.id')), 'commentCount']
                            ]
                        },
                        {
                            model: Tag,
                            as: 'tags',
                            through: { attributes: [] }
                        },
                        {
                            model: Category,
                            as: 'category',
                            attributes: ['name']
                        }
                    ],
                    attributes: {
                        include: [
                            [
                                sequelize.literal(`(
                                    (upvotes - flags + COALESCE(SUM(upvotes.karma), 0)) /
                                    POW(TIMESTAMPDIFF(HOUR, posts.createdAt, NOW()) + 2, ${GRAVITY}) *
                                    CASE WHEN TIMESTAMPDIFF(HOUR, posts.createdAt, NOW()) < ${EARLY_BOOST_THRESHOLD} THEN 1.5 ELSE 1 END
                                )`),
                                'score'
                            ]
                        ],
                    },
                    group: ['posts.id'],
                    order: [[sequelize.literal('score'), 'DESC']],
                    limit,
                    offset,
                });

                setCachedData(cacheKey, posts); // Cache the result for future requests
            } else {
                serverLogger.info(`Serving posts from cache for query: ${cacheKey}`);
            }

            res.status(200).json(posts);
        } catch (error) {
            serverLogger.error(`Error fetching posts: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post(async (req, res) => {
        try {
            const { title, content, authorId, tags, category } = req.body;

            // Validate Category
            let categoryInstance = null;
            if (category) {
                categoryInstance = await Category.findOne({ where: { name: category } });
                if (!categoryInstance) {
                    return res.status(404).json({ error: 'Category not found' });
                }
            }

            // Create Post
            const post = await Post.create({
                title,
                content,
                authorId,
                categoryId: categoryInstance ? categoryInstance.id : null,
            });

            // Associate Tags with the Post
            if (tags && tags.length > 0) {
                const tagInstances = await Tag.findAll({ where: { name: tags } });
                await post.setTags(tagInstances);
            }

            serverLogger.info(`New post created: ${title}`);
            res.status(201).json(post);
        } catch (error) {
            serverLogger.error(`Error creating post: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
