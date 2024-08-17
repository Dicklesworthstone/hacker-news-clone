import db from '../../models';
const { User } = db;
import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import serverLogger from '../../utils/server-logger';  // Corrected import path
import { getCachedData, setCachedData } from '../../utils/cache';  // Adjusted the path to two levels up

const signUpHandler = nc()
    .post(async (req, res) => {
        const { username, password } = req.body;

        try {
            // Input Validation
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            // Check Cache for Existing User
            const cacheKey = `user-${username}`;
            let existingUser = getCachedData(cacheKey);

            if (!existingUser) {
                existingUser = await User.findOne({ where: { username } });
                if (existingUser) {
                    setCachedData(cacheKey, existingUser); // Cache the existing user data
                }
            }

            // If user already exists
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the new user
            const newUser = await User.create({
                username,
                password: hashedPassword,
            });

            // Cache the new user data
            setCachedData(cacheKey, newUser);

            serverLogger.info(`New user created: ${username}`);

            // Return the created user (excluding password)
            res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                karma: newUser.karma,
                createdAt: newUser.createdAt,
            });
        } catch (error) {
            serverLogger.error(`Error during user signup: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export default signUpHandler;
