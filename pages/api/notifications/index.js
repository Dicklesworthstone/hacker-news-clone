import { createRouter } from 'next-connect';
import db from '../../../models';
const { Notification } = db;

const router = createRouter();

router.get(async (req, res) => {
    const { userId } = req.query;
    const notifications = await Notification.findAll({ where: { userId } });
    res.json(notifications);
});

router.post(async (req, res) => {
    const { userId, type, content } = req.body;
    const notification = await Notification.create({ userId, type, content });
    res.status(201).json(notification);
});

export default router.handler();
