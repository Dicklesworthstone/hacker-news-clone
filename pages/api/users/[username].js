import { createRouter } from 'next-connect';
import db from '../../../models';
const { User, Post, Comment } = db;
import serverLogger from '../../../utils/server-logger';
import { getCachedData, setCachedData } from '../../../utils/cache';

const router = createRouter();

router.get(async (req, res) => {
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
                serverLogger.warn(`User not found: ${username}`);
                return res.status(404).json({ error: 'User not found' });
            }

            setCachedData(cacheKey, user); // Cache the user data
            serverLogger.info(`User data for ${username} fetched from database and cached`);
        } else {
            serverLogger.info(`Serving user data for ${username} from cache`);
        }

        res.status(200).json(user);
    } catch (error) {
        serverLogger.error(`Error fetching user data for ${username}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router.handler();
