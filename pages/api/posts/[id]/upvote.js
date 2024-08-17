import nc from 'next-connect';
import db from '../../../../models';
const {Post, User, Upvote } = db;

const handler = nc()
    .put(async (req, res) => {
        const { id } = req.query;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        const post = await Post.findByPk(id);

        const existingUpvote = await Upvote.findOne({ where: { postId: id, userId } });
        if (!existingUpvote) {
            await Upvote.create({ postId: id, userId, karma: user.karma });
            post.upvotes += 1;
            await post.save();
            const author = await User.findByPk(post.authorId);
            author.karma += 1; // Increment author's karma
            await author.save();
        }

        res.json(post);
    });

export default handler;
