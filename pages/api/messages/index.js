import nc from 'next-connect';
import db from '../../../models';
const {Message} = db;

const handler = nc()
    .get(async (req, res) => {
        const { userId } = req.query;
        const messages = await Message.findAll({ where: { userId } });
        res.json(messages);
    })
    .post(async (req, res) => {
        const { userId, senderId, content } = req.body;
        const message = await Message.create({ userId, senderId, content });
        res.status(201).json(message);
    });

export default handler;
