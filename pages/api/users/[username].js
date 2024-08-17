import nc from 'next-connect';
import { User, Post, Comment } from '../../../models';
import logger from '../../../utils/logger';
import { getCachedData, setCachedData } from '../../../utils/cache';

const handler = nc()
    .get(async (req, res) => {
        try {
            const { username } = req.query;

            if (!username) {
                return res.status(400).json({ error: 'Username is required' });
            }

            const cacheKey = `user-${username}`;
            let user = getCachedData(cacheKey);

            if (!user) {
                user = await User.findOne({
                    where: { username },
                    include: [
                        { model: Post, as: 'posts', attributes: ['id', 'title'] },
                        { model: Comment, as: 'comments', attributes: ['id', 'content', 'postId'] },
                    ],
                });

                if (!user) {
                    logger.warn(`User not found: ${username}`);
                    return res.status(404).json({ error: 'User not found' });
                }

                setCachedData(cacheKey, user); // Cache the user data
                logger.info(`User data for ${username} fetched from database and cached`);
            } else {
                logger.info(`Serving user data for ${username} from cache`);
            }

            res.status(200).json(user);
        } catch (error) {
            logger.error(`Error fetching user data for ${username}: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
