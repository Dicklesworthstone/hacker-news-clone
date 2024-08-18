import { createRouter } from 'next-connect';
import db from '../../../models';
const { Tag } = db;

const router = createRouter();

router.get(async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

router.post(async (req, res) => {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
});

export default router.handler();
