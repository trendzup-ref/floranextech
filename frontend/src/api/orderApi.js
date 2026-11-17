import API from './axios.js';

/**
 * Fetch the public PayPal Client ID securely from backend.
 */
export const getPayPalClientId = async () => {
    const response = await API.get('/api/orders/paypal-client-id');
    return response.data;
};

/**
 * Initiate a local pending order for one or more eBooks.
 * @param {Object} data - { ebookId, items, paymentMethod }
 */
export const createOrder = async (data) => {
    const response = await API.post('/api/orders', data);
    return response.data;
};

/**
 * Request backend to initialize a server-side PayPal order.
 * @param {string} orderId - Local database order ID
 */
export const createPayPalOrder = async (orderId) => {
    const response = await API.post(`/api/orders/${orderId}/create-paypal-order`);
    return response.data;
};

/**
 * Capture an approved PayPal order on the server.
 * @param {string} orderId - Local database order ID
 * @param {string} paypalOrderId - PayPal Order ID
 */
export const capturePayPalOrder = async (orderId, paypalOrderId) => {
    const response = await API.post(`/api/orders/${orderId}/capture-paypal`, {
        paypalOrderId,
    });
    return response.data;
};

/**
 * Get details for a specific order.
 * @param {string} orderId
 */
export const getOrderDetails = async (orderId) => {
    const response = await API.get(`/api/orders/${orderId}`);
    return response.data;
};

/**
 * Get user's purchased orders history.
 * @param {Object} params - { page, limit }
 */
export const getUserOrders = async (params = {}) => {
    const response = await API.get('/api/orders/my-orders', { params });
    return response.data;
};

/**
 * Download purchased eBook via Axios with credentials and trigger browser download.
 * @param {string} ebookId
 * @param {string} fallbackFilename
 */
export const downloadPurchasedEbook = async (ebookId, fallbackFilename = 'ebook.pdf') => {
    const response = await API.get(`/api/orders/download/${ebookId}`, {
        responseType: 'blob',
    });

    // Try to get filename from Content-Disposition header
    let filename = fallbackFilename;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }
    }

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Download URL helper for purchased eBook.
 * @param {string} ebookId
 */
export const getEbookDownloadUrl = (ebookId) => {
    return `/api/orders/download/${ebookId}`;
};
