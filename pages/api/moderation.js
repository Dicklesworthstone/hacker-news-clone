import { createRouter } from 'next-connect';
import db from '../../models';
const { Post, User, Flag, Notification } = db;
import { Op } from 'sequelize';
import serverLogger from '../../utils/server-logger';
import { getCachedData, setCachedData } from '../../utils/cache';

const router = createRouter();

router.use(async (req, res, next) => {
    // Example middleware for authentication/authorization
    const user = req.user; // Assuming user is added to the req object by some auth middleware

    if (!user || !user.isAdmin) {
        serverLogger.warn(`Unauthorized access attempt by user: ${user ? user.username : 'unknown'}`);
        return res.status(403).json({ error: 'Access denied' });
    }

    next();
});

router.get(async (req, res) => {
    try {
        const cacheKey = 'flagged-posts';
        let flaggedPosts = getCachedData(cacheKey);

        if (!flaggedPosts) {
            flaggedPosts = await Post.findAll({
                where: { flags: { [Op.gt]: 0 } },
                include: [
                    { model: User, as: 'author', attributes: ['username'] },
                    { model: Flag, as: 'flags', include: [{ model: User, as: 'flaggedBy', attributes: ['username'] }] }
                ]
            });

            setCachedData(cacheKey, flaggedPosts); // Cache the flagged posts
        } else {
            serverLogger.info('Serving flagged posts from cache');
        }

        res.status(200).json(flaggedPosts);
    } catch (error) {
        serverLogger.error(`Error fetching flagged posts: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post(async (req, res) => {
    try {
        const { postId, reason, flaggedById } = req.body;

        // Validate Post
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Validate User
        const flaggedBy = await User.findByPk(flaggedById);
        if (!flaggedBy) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new flag
        const flag = await Flag.create({
            postId,
            reason,
            flaggedById,
        });

        // Notify admin about the flag
        await Notification.create({
            userId: post.authorId, // Assuming notification goes to the post author
            message: `Your post titled "${post.title}" has been flagged for moderation.`,
            link: `/posts/${postId}`
        });

        serverLogger.info(`Post flagged for moderation: ${post.title} by ${flaggedBy.username}`);

        res.status(201).json(flag);
    } catch (error) {
        serverLogger.error(`Error flagging post: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router.handler();
