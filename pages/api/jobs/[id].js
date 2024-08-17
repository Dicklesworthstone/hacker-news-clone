import nc from 'next-connect';
import { Job } from '../../../models';
import { getCachedData, setCachedData } from '../../../utils/cache';  // Import the cache utilities

const handler = nc()
    .get(async (req, res) => {
        const { id } = req.query;
        const cacheKey = `job-${id}`;  // Create a unique cache key for this job
        let job = getCachedData(cacheKey);  // Try to get the job from cache

        if (!job) {  // If the job is not in cache, fetch it from the database
            job = await Job.findByPk(id);
            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }
            setCachedData(cacheKey, job);  // Store the job in cache for future requests
        }

        res.json(job);  // Return the job data
    });

export default handler;
