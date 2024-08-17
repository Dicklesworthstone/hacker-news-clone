const cache = new Map();

export const getCachedData = (key) => {
    return cache.get(key);
};

export const setCachedData = (key, value) => {
    cache.set(key, value);
};
