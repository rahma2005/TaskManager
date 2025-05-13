document.addEventListener('DOMContentLoaded', function() {
    // Get logged in user's username from token
    function getLoggedInUser() {
        const token = localStorage.getItem('jwtToken');
        if (!token) return null;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload.sub; // username is stored in the 'sub' claim
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    // Fetch tasks and convert them to calendar events
    async function loadTaskEvents() {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) throw new Error('No authentication token found');

            const currentUsername = getLoggedInUser();
            if (!currentUsername) throw new Error('User information not found');

            const response = await fetch(ENDPOINTS.TASKS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch tasks');

            const tasks = await response.json();
            const myTasks = tasks.filter(task => 
                task.assignedTo === currentUsername || 
                (task.status === 'COMPLETED' && task.assignee === currentUsername)
            );

            return myTasks.map(task => ({
                id: task.id,
                title: task.title,
                start: task.dueDate,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: '#2c3e50',
                extendedProps: {
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    assignedBy: task.assignee,
                    originalAssignee: task.assignedTo || currentUsername // Store the original assignee
                },
                className: `task-priority-${task.priority.toLowerCase()}`,
                dataAttributes: {
                    status: task.status  
                }
            }));
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: false,
        selectable: false,
        selectMirror: false,
        dayMaxEvents: true,
        eventDisplay: 'block',

        eventDidMount: function(info) {
            // Add status data attribute for styling
            info.el.setAttribute('data-status', info.event.extendedProps.status);
        }
    });

    // Load tasks and render calendar
    loadTaskEvents().then(events => {
        calendar.removeAllEvents();
        events.forEach(event => calendar.addEvent(event));
        calendar.render();
        updateUpcomingTasks();
    });

    // Update upcoming tasks section
    function updateUpcomingTasks() {
        const upcomingEvents = calendar.getEvents()
            .filter(event => {
                const eventDate = new Date(event.start);
                const today = new Date();
                return eventDate >= today;
            })
            .sort((a, b) => a.start - b.start)
            .slice(0, 5);

        const container = document.querySelector('.upcoming-events');
        if (!container) return;

        container.innerHTML = upcomingEvents.length ? '' : '<p class="text-muted">No upcoming tasks</p>';

        upcomingEvents.forEach(event => {
            const props = event.extendedProps;
            container.innerHTML += `
                <div class="event">
                    <div class="event-date">
                        <div>${formatDate(event.start)}</div>
                    </div>
                    <div class="event-details">
                        <h6>${event.title}</h6>
                        <span class="badge bg-${getStatusBadgeClass(props.status)}">${props.status}</span>
                        <span class="badge bg-${getPriorityBadgeClass(props.priority)}">${props.priority}</span>
                    </div>
                </div>
            `;
        });
    }

    function formatDate(date) {
        if (!date) return 'No date';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'primary';
            case 'PENDING': return 'warning';
            default: return 'secondary';
        }
    }

    function getPriorityBadgeClass(priority) {
        switch (priority) {
            case 'HIGH': return 'danger';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'info';
            default: return 'secondary';
        }
    }

    // Refresh calendar data every 5 minutes
    setInterval(() => {
        loadTaskEvents().then(events => {
            calendar.removeAllEvents();
            events.forEach(event => calendar.addEvent(event));
            updateUpcomingTasks();
        });
    }, 300000);

    // Handle sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
            calendar.updateSize();
        });
    }
});

// Update task status
async function updateTaskStatus(taskId) {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('No authentication token found');

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

        // Reload the page to refresh the calendar
        location.reload();
    } catch (error) {
        console.error('Error updating task status:', error);
        alert('Failed to update task status. Please try again.');
    }
}

window.AuthService = {
    logout: function() {
        localStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
    }
};