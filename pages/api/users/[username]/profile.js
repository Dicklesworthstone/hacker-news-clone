import nc from 'next-connect';
import db from '../../../../models';
const {User} = db;
import serverLogger from '../../../../utils/server-logger';  // Corrected import path
import { getCachedData, setCachedData } from '../../../../utils/cache';

const handler = nc()
    .get(async (req, res) => {
        try {
            const { username } = req.query;

            // Validate that the username is provided
            if (!username) {
                return res.status(400).json({ error: 'Username is required' });
            }

            // Generate a cache key using the username
            const cacheKey = `user-profile-${username}`;
            let user = getCachedData(cacheKey);

            if (!user) {
                // Fetch the user profile from the database
                user = await User.findOne({
                    where: { username },
                    attributes: { exclude: ['password'] }, // Exclude sensitive information
                });

                // If the user is not found, log it and return a 404
                if (!user) {
                    serverLogger.warn(`User not found: ${username}`);
                    return res.status(404).json({ error: 'User not found' });
                }

                // Cache the user profile data
                setCachedData(cacheKey, user);
                serverLogger.info(`User profile for ${username} fetched from database and cached`);
            } else {
                serverLogger.info(`Serving user profile for ${username} from cache`);
            }

            // Return the user profile data
            res.status(200).json(user);
        } catch (error) {
            serverLogger.error(`Error fetching user profile for ${username}: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
