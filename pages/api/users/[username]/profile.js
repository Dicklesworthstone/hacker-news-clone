import nc from 'next-connect';
import db from '../../../../models';
const { User } = db;
import serverLogger from '../../../../utils/server-logger';
import { getCachedData, setCachedData } from '../../../../utils/cache';

const handler = nc()
    .get(async (req, res) => {
        try {
            const { username } = req.query;

            if (!username) {
                return res.status(400).json({ error: 'Username is required' });
            }

            const cacheKey = `user-profile-${username}`;
            let user = getCachedData(cacheKey);

            if (!user) {
                user = await User.findOne({
                    where: { username },
                    attributes: { exclude: ['password'] }, // Exclude sensitive information
                    include: ['posts', 'comments', 'messages', 'notifications'], // Include associated data
                });

                if (!user) {
                    serverLogger.warn(`User not found: ${username}`);
                    return res.status(404).json({ error: 'User not found' });
                }

                setCachedData(cacheKey, user);
                serverLogger.info(`User profile for ${username} fetched from database and cached`);
            } else {
                serverLogger.info(`Serving user profile for ${username} from cache`);
            }

            res.status(200).json(user);
        } catch (error) {
            serverLogger.error(`Error fetching user profile for ${username}: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
