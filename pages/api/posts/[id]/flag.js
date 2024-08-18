import { createRouter } from 'next-connect';
import db from '../../../../models';
const { Post } = db;

const router = createRouter();

router.put(async (req, res) => {
    const { id } = req.query;
    const post = await Post.findByPk(id);
    post.flags += 1;
    await post.save();
    res.json(post);
});

export default router.handler();
