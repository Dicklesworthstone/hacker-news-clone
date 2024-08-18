import { createRouter } from 'next-connect';
import db from '../../models';
const { Comment, User, Post } = db;
import serverLogger from '../../utils/server-logger';
import { getCachedData, setCachedData } from '../../utils/cache';
import { body, validationResult } from 'express-validator';

const router = createRouter();

// Middleware to validate incoming POST request data
router.use(
    body('postId').isInt().withMessage('Post ID is required and must be an integer'),
    body('authorId').isInt().withMessage('Author ID is required and must be an integer'),
    body('content').isString().trim().notEmpty().withMessage('Content is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
);

router.get(async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        const cacheKey = `comments-post-${postId}`;
        let comments = getCachedData(cacheKey);

        if (!comments) {
            comments = await Comment.findAll({
                where: { postId },
                include: [
                    {
                        model: User,
                        as: 'author', // Correct aliasing based on the relationship
                        attributes: ['username']
                    },
                    {
                        model: Comment,
                        as: 'replies', // Ensure that this alias is correct and consistent
                        include: [
                            {
                                model: User,
                                as: 'author', // Alias for User model in replies
                                attributes: ['username']
                            }
                        ],
                        limit: 10 // Limit replies to prevent too deep recursion
                    }
                ],
            });

            setCachedData(cacheKey, comments); // Cache the comments
            serverLogger.info(`Comments for post ${postId} fetched from database and cached`);
        } else {
            serverLogger.info(`Serving comments for post ${postId} from cache`);
        }

        res.status(200).json(comments);
    } catch (error) {
        serverLogger.error(`Error fetching comments for post ${postId}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post(async (req, res) => {
    try {
        const { postId, parentId, authorId, content } = req.body;

        // Validate post existence
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Validate user existence
        const user = await User.findByPk(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const comment = await Comment.create({ postId, parentId, authorId, content });

        // Invalidate cache after creating a new comment
        const cacheKey = `comments-post-${postId}`;
        setCachedData(cacheKey, null);

        serverLogger.info(`New comment created by user ${user.username} on post ${postId}`);

        res.status(201).json(comment);
    } catch (error) {
        serverLogger.error(`Error creating comment: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router.handler();
