import { createRouter } from 'next-connect';
import db from '../../../models';
const { Category } = db;

const router = createRouter();

router.get(async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

router.post(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
});

export default router.handler();
