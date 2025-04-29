const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_URLS = {
    base: API_BASE_URL,
    profile: `${API_BASE_URL}/api/profile`,
    // Adicione outras URLs aqui conforme necessário
};

export default API_URLS; 