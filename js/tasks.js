document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadEmployees();
});

let allTasks = [];

function loadTasks() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch(ENDPOINTS.TASKS, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    })
    .then(tasks => {
        allTasks = tasks;
        renderTasks(tasks);
    })
    .catch(error => {
        console.error('Error loading tasks:', error);
        document.getElementById('tasksTableBody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="alert alert-danger">Failed to load tasks. Please try again later.</div>
                </td>
            </tr>
        `;
    });
}

function renderTasks(tasks) {
    const tableBody = document.getElementById('tasksTableBody');
    tableBody.innerHTML = '';
    
    if (tasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="alert alert-info">No tasks found.</div>
                </td>
            </tr>
        `;
        return;
    }

    tasks.forEach(task => {
        const row = `
            <tr>
                <td>${task.title}</td>
                <td>${task.assignedTo || 'Unassigned'}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(task.status)}">
                        ${task.status}
                    </span>
                </td>
                <td>
                    <span class="badge ${getPriorityBadgeClass(task.priority)}">
                        ${task.priority}
                    </span>
                </td>
                <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'COMPLETED': return 'bg-success';
        case 'IN_PROGRESS': return 'bg-warning';
        default: return 'bg-secondary';
    }
}

function getPriorityBadgeClass(priority) {
    switch(priority) {
        case 'HIGH': return 'bg-danger';
        case 'MEDIUM': return 'bg-warning';
        default: return 'bg-info';
    }
}

document.getElementById('statusFilter').addEventListener('change', filterTasks);
document.getElementById('priorityFilter').addEventListener('change', filterTasks);
document.getElementById('assigneeFilter').addEventListener('change', filterTasks);
document.getElementById('searchInput').addEventListener('input', filterTasks);

function filterTasks() {
    const status = document.getElementById('statusFilter').value;
    const priority = document.getElementById('priorityFilter').value;
    const assignee = document.getElementById('assigneeFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();

    const filtered = allTasks.filter(task => {
        return (!status || task.status === status)
            && (!priority || task.priority === priority)
            && (!assignee || task.assignedTo === assignee)
            && (
                !search ||
                (task.title && task.title.toLowerCase().includes(search)) ||
                (task.description && task.description.toLowerCase().includes(search))
            );
    });

    renderTasks(filtered);
}

function loadEmployees() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch(ENDPOINTS.EMPLOYEES, {
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
        const assigneeSelect = document.getElementById('taskAssignee');
        const assigneeFilter = document.getElementById('assigneeFilter');
        
        // Clear existing options
        assigneeSelect.innerHTML = '<option value="">Select an employee</option>';
        assigneeFilter.innerHTML = '<option value="">All Assignees</option>';
        
        if (employees.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "No employees available";
            option.disabled = true;
            assigneeSelect.appendChild(option);
            return;
        }

        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.username;
            option.textContent = emp.name || emp.username;  // Use name if available, fallback to username
            assigneeSelect.appendChild(option);

            // For filter dropdown
            const filterOption = option.cloneNode(true);
            assigneeFilter.appendChild(filterOption);
        });
    })
    .catch(error => {
        console.error('Error loading employees:', error);
        const assigneeSelect = document.getElementById('taskAssignee');
        assigneeSelect.innerHTML = '<option value="">Error loading employees</option>';
    });
}

function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    fetch(ENDPOINTS.TASK_BY_ID(id), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
    .then(response => {
        if (response.ok) {
            loadTasks();
        } else {
            alert('Failed to delete task');
        }
    })
    .catch(error => console.error('Error deleting task:', error));
}

function editTask(id) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch(ENDPOINTS.TASK_BY_ID(id), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch task');
        }
        return response.json();
    })
    .then(task => {
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskAssignee').value = task.assignedTo || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
        
        // Show the modal
        var modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
        modal.show();
    })
    .catch(error => {
        console.error('Error fetching task:', error);
        alert('Failed to load task details. Please try again.');
    });
}

function saveTask() {
    const taskId = document.getElementById('taskId').value;
    const assignedToUsername = document.getElementById('taskAssignee').value;
    
    if (!assignedToUsername && !taskId) {
        alert('Please select an employee to assign the task to');
        return;
    }

    const newTask = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        assignedTo: assignedToUsername,  // Just send the username
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        dueDate: document.getElementById('taskDueDate').value
    };

    const method = taskId ? 'PUT' : 'POST';
    const url = taskId ? ENDPOINTS.TASK_BY_ID(taskId) : ENDPOINTS.TASKS;

    fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(newTask)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('taskForm').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
            modal.hide();
            loadTasks();
        } else {
            alert('Failed to save task');
        }
    })
    .catch(error => console.error('Error saving task:', error));
}

function showEditRoleModal(id, currentRole) {
    document.getElementById('editEmployeeId').value = id;
    document.getElementById('editEmployeeRole').value = currentRole;
    var modal = new bootstrap.Modal(document.getElementById('editRoleModal'));
    modal.show();
}

function saveEmployeeRole() {
    const id = document.getElementById('editEmployeeId').value;
    const newRole = document.getElementById('editEmployeeRole').value;
    fetch(ENDPOINTS.UPDATE_EMPLOYEE_ROLE(id), {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` 
        },
        body: JSON.stringify({ role: newRole })
    })
    .then(response => {
        if (response.ok) {
            // Hide modal and reload employees
            bootstrap.Modal.getInstance(document.getElementById('editRoleModal')).hide();
            loadEmployees();
        } else {
            alert('Failed to update role');
        }
    });
}