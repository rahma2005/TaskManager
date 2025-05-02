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

    fetch('http://localhost:8080/api/users/employees/preview', {
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
    fetch('http://localhost:8080/api/tasks/preview')
        .then(response => response.json())
        .then(tasks => {
            const container = document.querySelector('.tasks-list');
            container.innerHTML = '';
            tasks.forEach(task => {
                container.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${task.title}</strong>
                            <span class="badge bg-primary ms-2">${task.status}</span>
                        </div>
                        <small>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</small>
                    </div>
                `;
            });
        });
}

function loadDashboardSummary() {
    fetch('http://localhost:8080/api/dashboard/summary')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalEmployees').innerText = data.totalEmployees;
            document.getElementById('activeTasks').innerText = data.activeTasks;
            document.getElementById('completedTasks').innerText = data.completedTasks;
            document.getElementById('pendingTasks').innerText = data.pendingTasks;
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
}