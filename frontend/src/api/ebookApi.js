import API from './axios.js';

/**
 * Fetch all published eBooks for public visitors with pagination & search.
 * @param {Object} params - { page, limit, search, category }
 */
export const getPublicEbooks = async (params = {}) => {
    const response = await API.get('/api/ebooks', { params });
    return response.data;
};

/**
 * Fetch a single published eBook by its unique slug.
 * @param {string} slug
 */
export const getPublicEbookBySlug = async (slug) => {
    const response = await API.get(`/api/ebooks/${slug}`);
    return response.data;
};
