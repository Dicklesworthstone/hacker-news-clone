import { Op, sequelize } from 'sequelize';
import nc from 'next-connect';
import { Post, User, Upvote, Comment } from '../../models';
import logger from '../../utils/logger';
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
                    where.category = category;
                }
                if (tag) {
                    where.tags = { [Op.like]: `%${tag}%` };
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
                logger.info(`Serving posts from cache for query: ${cacheKey}`);
            }

            res.status(200).json(posts);
        } catch (error) {
            logger.error(`Error fetching posts: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
