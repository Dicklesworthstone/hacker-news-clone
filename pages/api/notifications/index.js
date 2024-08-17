import nc from 'next-connect';
import db from '../../../models';
const {Notification} = db;

const handler = nc()
    .get(async (req, res) => {
        const { userId } = req.query;
        const notifications = await Notification.findAll({ where: { userId } });
        res.json(notifications);
    })
    .post(async (req, res) => {
        const { userId, type, content } = req.body;
        const notification = await Notification.create({ userId, type, content });
        res.status(201).json(notification);
    });

export default handler;
