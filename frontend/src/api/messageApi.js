import API from './axios.js';

export const sendContactEnquiry = async (enquiryData) => {
    const response = await API.post('/api/message/enquiry', enquiryData);
    return response.data;
};

