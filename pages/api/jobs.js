import nc from 'next-connect';
import { Job } from '../../models';
import logger from '../../utils/logger';
import { getCachedData, setCachedData } from '../../utils/cache';
import { body, validationResult } from 'express-validator';

const handler = nc()
    // Middleware for input validation
    .use(
        body('title').isString().trim().notEmpty().withMessage('Title is required'),
        body('company').isString().trim().notEmpty().withMessage('Company is required'),
        body('description').isString().trim().notEmpty().withMessage('Description is required'),
        body('location').isString().trim().notEmpty().withMessage('Location is required'),
        body('url').isURL().withMessage('Valid URL is required'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    )
    .get(async (req, res) => {
        try {
            const cacheKey = 'jobs-list';
            let jobs = getCachedData(cacheKey);

            if (!jobs) {
                jobs = await Job.findAll();
                setCachedData(cacheKey, jobs); // Cache the job listings
                logger.info('Jobs fetched from database and cached');
            } else {
                logger.info('Serving jobs from cache');
            }

            res.status(200).json(jobs);
        } catch (error) {
            logger.error(`Error fetching jobs: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post(async (req, res) => {
        try {
            const { title, company, description, location, url } = req.body;
            const job = await Job.create({ title, company, description, location, url });

            // Invalidate the cache after creating a new job
            const cacheKey = 'jobs-list';
            setCachedData(cacheKey, null);

            logger.info(`New job posted: ${title} at ${company}`);

            res.status(201).json(job);
        } catch (error) {
            logger.error(`Error creating job: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
