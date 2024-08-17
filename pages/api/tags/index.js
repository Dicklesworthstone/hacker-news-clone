import nc from 'next-connect';
import db from '../../../models';
const {Tag} = db;

const handler = nc()
    .get(async (req, res) => {
        const tags = await Tag.findAll();
        res.json(tags);
    })
    .post(async (req, res) => {
        const { name } = req.body;
        const tag = await Tag.create({ name });
        res.status(201).json(tag);
    });

export default handler;
