const commonPages = [
    '/index.html',
    '/profile.html'
];

const managerPages = [
    '/dashboard-manager.html',
    '/employees.html',
    '/tasks.html'
];

const employeePages = [
    '/calendar.html',
    '/dashboard-employee.html',
    '/my-tasks.html'
];

// Check Authentication and Authorization
function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');
    
    // Get the current page path, handling both full and relative paths
    let currentPage = window.location.pathname;
    currentPage = currentPage.includes('TaskManager') 
        ? currentPage.split('TaskManager')[1] 
        : currentPage;

    // Skip auth check for login page
    if (currentPage.includes('login.html')) {
        return;
    }

    // Check if user is logged in
    if (!token || !role) {
        console.log('No auth token or role found, redirecting to login...');
        window.location.href = 'login.html';
        return;
    }

    // Check page authorization
    const isCommonPage = commonPages.some(page => currentPage.includes(page));
    if (isCommonPage) {
        return; // Allow access to common pages
    }

    if (role === 'MANAGER') {
        const isManagerPage = managerPages.some(page => currentPage.includes(page));
        if (!isManagerPage) {
            console.log('Unauthorized page for manager, redirecting...');
            window.location.href = 'dashboard-manager.html';
        }
    } else if (role === 'EMPLOYEE') {
        const isEmployeePage = employeePages.some(page => currentPage.includes(page));
        if (!isEmployeePage) {
            console.log('Unauthorized page for employee, redirecting...');
            window.location.href = 'dashboard-employee.html';
        }
    }
}

checkAuth();
