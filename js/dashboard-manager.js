document.addEventListener('DOMContentLoaded', function() {
    loadEmployeePreview();
    loadTaskPreview();
    loadDashboardSummary();
});

function loadEmployeePreview() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch(ENDPOINTS.EMPLOYEES_PREVIEW, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            return response.json();
        })
        .then(employees => {
            const container = document.querySelector('.employee-status-list');
            container.innerHTML = '';
            
            if (employees.length === 0) {
                container.innerHTML = '<div class="alert alert-info">No employees found.</div>';
                return;
            }

            employees.forEach(emp => {
                container.innerHTML += `
                    <div class="employee-status-item d-flex align-items-center mb-3 p-2 border rounded">
                        <div class="employee-info d-flex align-items-center flex-grow-1">
                            <img src="${'images/profile.jpg'}" class="rounded-circle me-3" 
                                 alt="Profile" style="width: 40px; height: 40px; object-fit: cover;">
                            <div class="employee-details">
                                <h6 class="mb-0">${emp.name || emp.username}</h6>
                                <div class="mt-1">
                                    <span class="badge bg-primary">${emp.department || 'Not Set'}</span>
                                    <span class="badge ${getStatusBadgeClass(emp.status)} ms-2">${emp.status || 'PENDING'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error loading employees:', error);
            document.querySelector('.employee-status-list').innerHTML = 
                '<div class="alert alert-danger">Failed to load employees. Please try again later.</div>';
        });
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'ACTIVE':
            return 'bg-success';
        case 'INACTIVE':
            return 'bg-danger';
        case 'ON_LEAVE':
            return 'bg-warning';
        default:
            return 'bg-secondary';
    }
}

function loadTaskPreview() {
    const token = localStorage.getItem('jwtToken');
    
    fetch(ENDPOINTS.TASKS_PREVIEW, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task preview');
            }
            return response.json();
        })
        .then(tasks => {
            const container = document.querySelector('.tasks-list');
            container.innerHTML = '';
            
            if (tasks.length === 0) {
                container.innerHTML = '<div class="text-muted">No tasks found</div>';
                return;
            }
            
            tasks.forEach(task => {
                container.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                        <div>
                            <strong>${task.title || 'Untitled Task'}</strong>
                            <span class="badge ${getTaskStatusBadgeClass(task.status)} ms-2">${task.status || 'PENDING'}</span>
                        </div>
                        <small>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</small>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error loading task preview:', error);
            document.querySelector('.tasks-list').innerHTML = '<div class="alert alert-danger">Failed to load tasks</div>';
            
            // Try fallback method if preview endpoint is not available
            loadTaskPreviewFallback();
        });
}

// Helper function for task status badge color
function getTaskStatusBadgeClass(status) {
    switch (status) {
        case 'COMPLETED': return 'bg-success';
        case 'IN_PROGRESS': return 'bg-primary';
        case 'PENDING': return 'bg-warning';
        default: return 'bg-secondary';
    }
}

// Fallback for task preview when the preview endpoint is not available
async function loadTaskPreviewFallback() {
    try {
        const token = localStorage.getItem('jwtToken');
        
        const response = await fetch(ENDPOINTS.TASKS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch tasks for fallback preview');
        }
        
        const allTasks = await response.json();
        
        // Get only the 5 most recent tasks for preview
        const recentTasks = allTasks
            .sort((a, b) => new Date(b.createdAt || b.dueDate || 0) - new Date(a.createdAt || a.dueDate || 0))
            .slice(0, 5);
            
        const container = document.querySelector('.tasks-list');
        container.innerHTML = '';
        
        if (recentTasks.length === 0) {
            container.innerHTML = '<div class="text-muted">No tasks found</div>';
            return;
        }
        
        recentTasks.forEach(task => {
            container.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                    <div>
                        <strong>${task.title || 'Untitled Task'}</strong>
                        <span class="badge ${getTaskStatusBadgeClass(task.status)} ms-2">${task.status || 'PENDING'}</span>
                    </div>
                    <small>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</small>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error in task preview fallback:', error);
        document.querySelector('.tasks-list').innerHTML = '<div class="alert alert-danger">Failed to load tasks</div>';
    }
}

function loadDashboardSummary() {
    const token = localStorage.getItem('jwtToken');
    
    // Set initial values to 0 instead of undefined
    document.getElementById('totalEmployees').innerText = '0';
    document.getElementById('activeTasks').innerText = '0';
    document.getElementById('completedTasks').innerText = '0';
    document.getElementById('pendingTasks').innerText = '0';
    
    fetch(ENDPOINTS.DASHBOARD_SUMMARY, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard summary');
            }
            return response.json();
        })
        .then(data => {
            // Update stats only if data values exist
            document.getElementById('totalEmployees').innerText = data.totalEmployees || '0';
            document.getElementById('activeTasks').innerText = data.activeTasks || '0';
            document.getElementById('completedTasks').innerText = data.completedTasks || '0';
            document.getElementById('pendingTasks').innerText = data.pendingTasks || '0';
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            // Since we already set default values, no need to set them again here
            
            // Let's implement a fallback method to calculate stats if dashboard summary endpoint is not available
            loadDashboardStatsFallback();
        });
}

// Fallback function to calculate dashboard stats when the summary endpoint isn't available
async function loadDashboardStatsFallback() {
    try {
        const token = localStorage.getItem('jwtToken');
        
        // Get employees count
        const employeesResponse = await fetch(ENDPOINTS.EMPLOYEES, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Get tasks to calculate task stats
        const tasksResponse = await fetch(ENDPOINTS.TASKS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!employeesResponse.ok || !tasksResponse.ok) {
            throw new Error('Failed to fetch data for fallback stats calculation');
        }
        
        const employees = await employeesResponse.json();
        const tasks = await tasksResponse.json();
        
        // Calculate stats
        const totalEmployees = employees.length;
        const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
        const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
        
        // Update UI
        document.getElementById('totalEmployees').innerText = totalEmployees;
        document.getElementById('activeTasks').innerText = activeTasks;
        document.getElementById('completedTasks').innerText = completedTasks;
        document.getElementById('pendingTasks').innerText = pendingTasks;
    } catch (error) {
        console.error('Error in fallback stats calculation:', error);
    }
}