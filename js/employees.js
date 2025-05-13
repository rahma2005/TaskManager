document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for filter changes
    document.getElementById('statusFilter').addEventListener('change', loadEmployees);
    document.getElementById('departmentFilter').addEventListener('change', loadEmployees);
    document.querySelector('input[type="text"]').addEventListener('input', loadEmployees);  // For search
    
    // Initial load of employees
    loadEmployees();
});

function loadEmployees() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Get the current values from the filter inputs
    const statusFilter = document.getElementById('statusFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value;
    const searchQuery = document.querySelector('input[type="text"]').value.trim();

    // Construct the API URL with query parameters for filters
    let url = `${ENDPOINTS.EMPLOYEES}?status=${statusFilter}&department=${departmentFilter}&search=${searchQuery}`;

    // Fetch employee data with filters applied
    fetch(url, {
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
            const grid = document.getElementById('employeeGrid');
            grid.innerHTML = '';
            if (employees.length === 0) {
                grid.innerHTML = '<div class="col-12"><div class="alert alert-warning">No employees found matching the filters.</div></div>';
                return;
            }

            employees.forEach(emp => {
                const card = document.createElement('div');
                card.className = 'col-md-4';
                card.innerHTML = `
                    <div class="card employee-card mb-4">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <img src="${'images/profile.jpg'}" class="rounded-circle me-3" alt="Profile" style="width: 80px; height: 80px; object-fit: cover;">
                                <div>
                                    <h5 class="mb-0">${emp.name || emp.username}</h5>
                                    <small class="text-muted">${emp.email}</small>
                                </div>
                            </div>
                            <div>
                                <span class="badge bg-primary">${emp.department || 'Not Set'}</span>
                                <span class="badge ${getStatusBadgeClass(emp.status)} ms-2">${emp.status || 'PENDING'}</span>
                                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="showEditModal('${emp.id}', '${emp.department || ''}', '${emp.status || ''}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => {
            document.getElementById('employeeGrid').innerHTML = '<div class="col-12"><div class="alert alert-danger">Failed to load employees. Please try again later.</div></div>';
            console.error('Error loading employees:', error);
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

window.showEditModal = function(id, currentDepartment, currentStatus) {
    document.getElementById('editEmployeeId').value = id;
    document.getElementById('editEmployeeDepartment').value = currentDepartment;
    document.getElementById('editEmployeeStatus').value = currentStatus;
    var modal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
    modal.show();
}

window.saveEmployeeInfo = function() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const id = document.getElementById('editEmployeeId').value;
    const newDepartment = document.getElementById('editEmployeeDepartment').value;
    const newStatus = document.getElementById('editEmployeeStatus').value;

    fetch(ENDPOINTS.UPDATE_EMPLOYEE(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            department: newDepartment, 
            status: newStatus 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update employee');
        }
        return response.json();
    })
    .then(() => {
        bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal')).hide();
        loadEmployees();  // Reload employees after update
        // Show success message
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-success alert-dismissible fade show';
        alertContainer.innerHTML = `
            Employee information updated successfully
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container-fluid').insertBefore(alertContainer, document.querySelector('.d-flex'));
    })
    .catch(error => {
        console.error('Error updating employee:', error);
        alert('Failed to update employee information. Please try again.');
    });
}
