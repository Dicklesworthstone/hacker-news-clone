import { Op, fn, col, literal } from 'sequelize';
import { createRouter } from 'next-connect';
import db from '../../models';
const { Post, User, Upvote, Comment, Tag, Category, PostTag } = db;
import serverLogger from '../../utils/server-logger';
import { getCachedData, setCachedData } from '../../utils/cache';

const GRAVITY = 1.8;
const EARLY_BOOST_THRESHOLD = 12;

const router = createRouter();

router.get(async (req, res) => {
    try {
        const { page = 1, sortBy, tag, category } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const cacheKey = `posts-${page}-${sortBy}-${tag}-${category}`;
        let posts = getCachedData(cacheKey);

        if (!posts) {
            const where = {};

            if (category) {
                serverLogger.info(`Looking up category: ${category}`);
                const categoryInstance = await Category.findOne({ where: { name: category } });
                if (categoryInstance) {
                    where.categoryId = categoryInstance.id;
                    serverLogger.info(`Found category with ID: ${categoryInstance.id}`);
                } else {
                    serverLogger.warn(`Category not found: ${category}`);
                    return res.status(404).json({ error: 'Category not found' });
                }
            }

            if (tag) {
                serverLogger.info(`Looking up tag: ${tag}`);
                const tagInstance = await Tag.findOne({ where: { name: tag } });
                if (tagInstance) {
                    where['$Tags.id$'] = tagInstance.id;
                    serverLogger.info(`Found tag with ID: ${tagInstance.id}`);
                } else {
                    serverLogger.warn(`Tag not found: ${tag}`);
                    return res.status(404).json({ error: 'Tag not found' });
                }
            }

            serverLogger.info('Running Post.findAll query with where clause:', where);

            posts = await Post.findAll({
                where,
                include: [
                    { model: User, as: 'author' },
                    {
                        model: Upvote
                    },
                    {
                        model: Comment,
                        as: 'Comments', // Ensure consistent alias usage
                        attributes: [
                            [fn('COUNT', col('Comments.id')), 'commentCount'] // Use the correct alias here
                        ]
                    },
                    {
                        model: Tag,
                        as: 'Tags',
                        through: { attributes: [] }
                    },
                    {
                        model: Category,
                        as: 'Category',
                        attributes: ['name']
                    }
                ],
                attributes: {
                    include: [
                        [
                            literal(`(
                                (Post.upvotes - Post.flags) /
                                POW((strftime('%s', 'now') - strftime('%s', Post.createdAt)) / 3600 + 2, ${GRAVITY}) *
                                CASE WHEN ((strftime('%s', 'now') - strftime('%s', Post.createdAt)) / 3600) < ${EARLY_BOOST_THRESHOLD} THEN 1.5 ELSE 1 END
                            )`),
                            'score'
                        ]
                    ],
                },
                group: ['Post.id'],
                order: [[literal('score'), 'DESC']],
                limit,
                offset,
            });

            setCachedData(cacheKey, posts);
        } else {
            serverLogger.info(`Serving posts from cache for query: ${cacheKey}`);
        }

        serverLogger.info('Returning posts data');
        res.status(200).json(posts);
    } catch (error) {
        serverLogger.error(`Error fetching posts: ${error.message}`);
        console.error('Detailed error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post(async (req, res) => {
    try {
        const { title, content, authorId, tags, category } = req.body;

        let categoryInstance = null;
        if (category) {
            serverLogger.info(`Validating category: ${category}`);
            categoryInstance = await Category.findOne({ where: { name: category } });
            if (!categoryInstance) {
                serverLogger.warn(`Category not found: ${category}`);
                return res.status(404).json({ error: 'Category not found' });
            }
            serverLogger.info(`Category validated with ID: ${categoryInstance.id}`);
        }

        serverLogger.info(`Creating new post: ${title}`);
        const post = await Post.create({
            title,
            content,
            authorId,
            categoryId: categoryInstance ? categoryInstance.id : null,
        });

        if (tags && tags.length > 0) {
            serverLogger.info(`Associating tags with post: ${tags.join(', ')}`);
            const tagInstances = await Tag.findAll({ where: { name: tags } });
            await post.setTags(tagInstances);
        }

        serverLogger.info(`New post created with ID: ${post.id}`);
        res.status(201).json(post);
    } catch (error) {
        serverLogger.error(`Error creating post: ${error.message}`);
        console.error('Detailed error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router.handler();
