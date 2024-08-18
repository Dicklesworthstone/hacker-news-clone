import { createRouter } from 'next-connect';
import db from '../../../models';
const { Message } = db;

const router = createRouter();

router.get(async (req, res) => {
    const { userId } = req.query;
    const messages = await Message.findAll({ where: { userId } });
    res.json(messages);
});

router.post(async (req, res) => {
    const { userId, senderId, content } = req.body;
    const message = await Message.create({ userId, senderId, content });
    res.status(201).json(message);
});

export default router.handler();
