// Get logged in user's username from token
function getLoggedInUser() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;
    
    try {
        // Decode the JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload.sub; // username is stored in the 'sub' claim
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Fetch tasks for the logged-in employee
async function loadMyTasks(filters = {}) {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const currentUsername = getLoggedInUser();
        if (!currentUsername) {
            throw new Error('User information not found');
        }

        let myTasks = [];
        
        // Try to get tasks using the specific assigned tasks endpoint
        try {
            const response = await fetch(ENDPOINTS.ASSIGNED_TASKS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                myTasks = await response.json();
            } else {
                throw new Error('Assigned tasks endpoint failed');
            }
        } catch (error) {
            console.warn('Using fallback method to fetch tasks:', error.message);
            
            // Fallback: get all tasks and filter for the current user
            const allTasksResponse = await fetch(ENDPOINTS.TASKS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!allTasksResponse.ok) {
                throw new Error('Failed to fetch tasks');
            }
            
            const allTasks = await allTasksResponse.json();
            myTasks = allTasks.filter(task => task.assignedTo === currentUsername);
        }
        
        // Apply additional filters
        let filteredTasks = [...myTasks]; // Create a copy to filter
        
        if (filters.status) {
            filteredTasks = filteredTasks.filter(task => task.status === filters.status.toUpperCase());
        }
        if (filters.priority) {
            filteredTasks = filteredTasks.filter(task => task.priority === filters.priority.toUpperCase());
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredTasks = filteredTasks.filter(task => 
                (task.title && task.title.toLowerCase().includes(searchLower)) ||
                (task.description && task.description.toLowerCase().includes(searchLower))
            );
        }
        if (filters.dueDate) {
            const today = new Date();
            switch(filters.dueDate) {
                case 'today':
                    filteredTasks = filteredTasks.filter(task => {
                        if (!task.dueDate) return false;
                        const taskDate = new Date(task.dueDate);
                        return taskDate.toDateString() === today.toDateString();
                    });
                    break;
                case 'week':
                    const weekFromNow = new Date(today);
                    weekFromNow.setDate(today.getDate() + 7);
                    filteredTasks = filteredTasks.filter(task => {
                        if (!task.dueDate) return false;
                        const taskDate = new Date(task.dueDate);
                        return taskDate >= today && taskDate <= weekFromNow;
                    });
                    break;
                case 'month':
                    const monthFromNow = new Date(today);
                    monthFromNow.setMonth(today.getMonth() + 1);
                    filteredTasks = filteredTasks.filter(task => {
                        if (!task.dueDate) return false;
                        const taskDate = new Date(task.dueDate);
                        return taskDate >= today && taskDate <= monthFromNow;
                    });
                    break;
            }
        }

        displayTasks(filteredTasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        const tasksListElement = document.getElementById('tasksList');
        tasksListElement.innerHTML = `<div class="alert alert-danger">Failed to load tasks. Please try again later.</div>`;
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    const tasksListElement = document.getElementById('tasksList');
    if (!tasks || tasks.length === 0) {
        tasksListElement.innerHTML = '<div class="text-center p-4">No tasks found</div>';
        return;
    }

    const taskHTML = tasks.map(task => `
        <div class="task-item card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-1">${task.title || 'Untitled Task'}</h5>
                    <span class="badge bg-${getPriorityBadgeColor(task.priority || 'MEDIUM')}">${task.priority || 'MEDIUM'}</span>
                </div>
                <p class="card-text text-muted mb-2">${task.description || 'No description provided'}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-${getStatusBadgeColor(task.status || 'PENDING')}">${task.status || 'PENDING'}</span>
                        <small class="text-muted ms-2">Due: ${formatDate(task.dueDate)}</small>
                        <small class="text-muted ms-2">Assigned by: ${task.assignee || 'System'}</small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="updateTaskStatus('${task.id}')">
                            Update Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    tasksListElement.innerHTML = taskHTML;
}

// Helper function to get appropriate badge color for priority
function getPriorityBadgeColor(priority) {
    switch (priority) {
        case 'HIGH': return 'danger';
        case 'MEDIUM': return 'warning';
        case 'LOW': return 'info';
        default: return 'secondary';
    }
}

// Helper function to get appropriate badge color for status
function getStatusBadgeColor(status) {
    switch (status) {
        case 'COMPLETED': return 'success';
        case 'IN_PROGRESS': return 'primary';
        case 'PENDING': return 'warning';
        default: return 'secondary';
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Update task status
async function updateTaskStatus(taskId) {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // First, fetch the current task data
        const getResponse = await fetch(ENDPOINTS.TASK_BY_ID(taskId), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!getResponse.ok) throw new Error('Failed to fetch task data');

        const currentTask = await getResponse.json();
        const newStatus = prompt('Enter new status (PENDING, IN_PROGRESS, COMPLETED):').toUpperCase();
        
        if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(newStatus)) {
            alert('Invalid status');
            return;
        }

        // Preserve all existing task data and only update the status
        const updatedTask = {
            ...currentTask,
            status: newStatus
        };

        const response = await fetch(ENDPOINTS.TASK_BY_ID(taskId), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) throw new Error('Failed to update task status');

        // Refresh tasks display
        await loadMyTasks();
        
        // Show success message
        alert(`Task status updated to ${newStatus}`);
    } catch (error) {
        console.error('Error updating task status:', error);
        alert('Failed to update task status. Please try again.');
    }
}

// Set up event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
    // Initial load
    loadMyTasks();

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', function(e) {
        loadMyTasks({ status: e.target.value });
    });

    // Priority filter
    document.getElementById('priorityFilter').addEventListener('change', function(e) {
        loadMyTasks({ priority: e.target.value });
    });

    // Due date filter
    document.getElementById('dueDateFilter').addEventListener('change', function(e) {
        loadMyTasks({ dueDate: e.target.value });
    });

    // Search
    let searchTimeout;
    document.getElementById('searchTasks').addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadMyTasks({ search: e.target.value });
        }, 300);
    });
}); 