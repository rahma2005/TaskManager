// Navigation configuration for different roles
const navigationConfig = {
    MANAGER: [
        { href: 'dashboard-manager.html', icon: 'fas fa-home', text: 'Dashboard' },
        { href: 'employees.html', icon: 'fas fa-users', text: 'Employees' },
        { href: 'tasks.html', icon: 'fas fa-tasks', text: 'Tasks' }
    ],
    EMPLOYEE: [
        { href: 'dashboard-employee.html', icon: 'fas fa-home', text: 'Dashboard' },
        { href: 'my-tasks.html', icon: 'fas fa-tasks', text: 'My Tasks' },
        { href: 'calendar.html', icon: 'fas fa-calendar', text: 'Calendar' }
    ]
};

// Function to update navigation based on user role
function updateNavigation() {
    const userRole = localStorage.getItem('userRole');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    
    if (!sidebarMenu || !userRole) return;

    // Clear existing menu items
    sidebarMenu.innerHTML = '';

    // Get navigation items for the user's role
    const navItems = navigationConfig[userRole] || [];

    // Create and append new menu items
    navItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${item.href}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `;
        sidebarMenu.appendChild(li);
    });
}

// Initialize navigation when the page loads
document.addEventListener('DOMContentLoaded', updateNavigation);

// Export the updateNavigation function for use in other scripts
window.Navigation = {
    update: updateNavigation
}; 