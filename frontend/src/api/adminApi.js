import API from './axios.js';

/**
 * Fetch all users with pagination and optional search filter.
 * @param {Object} params - { page, limit, search }
 */
export const getAllUsers = async (params = {}) => {
    const response = await API.get('/api/admin/users', { params });
    return response.data;
};

/**
 * Delete a user by ID.
 * @param {string} userId
 */
export const deleteUser = async (userId) => {
    const response = await API.delete(`/api/admin/users/${userId}`);
    return response.data;
};

/**
 * Fetch all eBooks with pagination and optional search filter.
 * @param {Object} params - { page, limit, search }
 */
export const getAllEbooks = async (params = {}) => {
    const response = await API.get('/api/admin/ebooks', { params });
    return response.data;
};

/**
 * Publish a new eBook.
 * Accepts either FormData (for file uploads to GridFS) or a JSON object.
 * @param {FormData|Object} ebookData
 */
export const publishEbook = async (ebookData) => {
    const isFormData = typeof FormData !== 'undefined' && ebookData instanceof FormData;
    const response = await API.post('/api/admin/ebooks', ebookData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
};

/**
 * Get eBook details by MongoDB ObjectId or unique slug.
 * @param {string} idOrSlug
 */
export const getEbookDetails = async (idOrSlug) => {
    const response = await API.get(`/api/admin/ebooks/${idOrSlug}`);
    return response.data;
};

/**
 * Delete an eBook by ID.
 * @param {string} ebookId
 */
export const deleteEbook = async (ebookId) => {
    const response = await API.delete(`/api/admin/ebooks/${ebookId}`);
    return response.data;
};

/**
 * Fetch all contact messages with server-side pagination and optional search filter.
 * @param {Object} params - { page, limit, search }
 */
export const getAllContactMessages = async (params = {}) => {
    const response = await API.get('/api/admin/messages', { params });
    return response.data;
};

/**
 * Get details of a single contact message by ID.
 * @param {string} messageId
 */
export const getContactMessageDetails = async (messageId) => {
    const response = await API.get(`/api/admin/messages/${messageId}`);
    return response.data;
};

/**
 * Delete a specific contact message by ID.
 * @param {string} messageId
 */
export const deleteContactMessage = async (messageId) => {
    const response = await API.delete(`/api/admin/messages/${messageId}`);
    return response.data;
};
