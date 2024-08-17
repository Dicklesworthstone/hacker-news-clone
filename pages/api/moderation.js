import nc from 'next-connect';
import { Post } from '../../models';
import { Op } from 'sequelize';
import logger from '../../utils/logger';
import { getCachedData, setCachedData } from '../../utils/cache';

const handler = nc()
    .use(async (req, res, next) => {
        // Example middleware for authentication/authorization
        const user = req.user; // Assuming user is added to the req object by some auth middleware

        if (!user || !user.isAdmin) {
            logger.warn(`Unauthorized access attempt by user: ${user ? user.username : 'unknown'}`);
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    })
    .get(async (req, res) => {
        try {
            const cacheKey = 'flagged-posts';
            let flaggedPosts = getCachedData(cacheKey);

            if (!flaggedPosts) {
                flaggedPosts = await Post.findAll({ 
                    where: { flags: { [Op.gt]: 0 } },
                    include: [
                        { model: User, as: 'author', attributes: ['username'] }
                    ]
                });

                setCachedData(cacheKey, flaggedPosts); // Cache the flagged posts
            } else {
                logger.info('Serving flagged posts from cache');
            }

            res.status(200).json(flaggedPosts);
        } catch (error) {
            logger.error(`Error fetching flagged posts: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
