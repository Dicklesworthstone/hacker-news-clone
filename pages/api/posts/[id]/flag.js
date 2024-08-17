import nc from 'next-connect';
import { Post } from '../../../../models';

const handler = nc()
    .put(async (req, res) => {
        const { id } = req.query;
        const post = await Post.findByPk(id);
        post.flags += 1;
        await post.save();
        res.json(post);
    });

export default handler;
