// Microservices API URLs
const API_CONFIG = {
    USER_SERVICE_URL: 'http://localhost:8081/api',
    TASK_SERVICE_URL: 'http://localhost:8082/api',
};

// API endpoints
const ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_CONFIG.USER_SERVICE_URL}/auth/login`,
    REGISTER: `${API_CONFIG.USER_SERVICE_URL}/auth/register`,
    
    // User endpoints
    USER_PROFILE: (username) => `${API_CONFIG.USER_SERVICE_URL}/users/${username}`,
    USER_BY_ID: (id) => `${API_CONFIG.USER_SERVICE_URL}/users/id/${id}`,
    EMPLOYEES: `${API_CONFIG.USER_SERVICE_URL}/users/employees`,
    EMPLOYEES_PREVIEW: `${API_CONFIG.USER_SERVICE_URL}/users/employees/preview`,
    UPDATE_EMPLOYEE_ROLE: (id) => `${API_CONFIG.USER_SERVICE_URL}/users/employees/${id}/role`,
    UPDATE_EMPLOYEE_DEPARTMENT: (id) => `${API_CONFIG.USER_SERVICE_URL}/users/employees/${id}/department`,
    UPDATE_EMPLOYEE: (id) => `${API_CONFIG.USER_SERVICE_URL}/users/employees/${id}/update`,
    
    // Task endpoints
    TASKS: `${API_CONFIG.TASK_SERVICE_URL}/tasks`,
    TASK_BY_ID: (id) => `${API_CONFIG.TASK_SERVICE_URL}/tasks/${id}`,
    TASKS_PREVIEW: `${API_CONFIG.TASK_SERVICE_URL}/tasks/preview`,
    ASSIGNED_TASKS: `${API_CONFIG.TASK_SERVICE_URL}/tasks/assigned`,
    CREATED_TASKS: `${API_CONFIG.TASK_SERVICE_URL}/tasks/created`,
    FILTER_TASKS: `${API_CONFIG.TASK_SERVICE_URL}/tasks/filter`,
    
    // Dashboard endpoints
    DASHBOARD_SUMMARY: `${API_CONFIG.TASK_SERVICE_URL}/dashboard/summary`
}; 