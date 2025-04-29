const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_URLS = {
    base: BASE_URL,
    login: `${BASE_URL}/api/auth/login`,
    register: `${BASE_URL}/api/auth/register`,
    profile: `${BASE_URL}/api/users/profile`,
    auth: {
        google: `${BASE_URL}/api/auth/google`,
        twitter: `${BASE_URL}/api/auth/twitter`,
        discord: `${BASE_URL}/api/auth/discord`,
        status: `${BASE_URL}/api/auth/status`
    }
};

export const API_CONFIG = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

export default API_URLS; 