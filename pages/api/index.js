import nc from 'next-connect';
import logger from '../../utils/logger';
import { getCachedData, setCachedData } from '../../utils/cache';

const handler = nc()
    .get(async (req, res) => {
        try {
            // Define a cache key for this endpoint
            const cacheKey = 'api-info';
            let apiInfo = getCachedData(cacheKey);

            if (!apiInfo) {
                // Information about the API
                apiInfo = {
                    name: 'Hacker News Clone API',
                    version: '1.0.0',
                    description: 'This API serves data for the Hacker News Clone application.',
                    uptime: process.uptime(),
                    status: 'running',
                    timestamp: new Date().toISOString(),
                };

                // Cache the API info to avoid regenerating on every request
                setCachedData(cacheKey, apiInfo);
                logger.info('API info generated and cached');
            } else {
                logger.info('Serving API info from cache');
            }

            res.status(200).json(apiInfo);
        } catch (error) {
            logger.error(`Error fetching API info: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default handler;
