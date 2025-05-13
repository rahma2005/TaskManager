document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    function getLoggedInUser() {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload.sub;
        } catch {
            return null;
        }
    }
    const username = getLoggedInUser();

    // Fetch tasks for the user
    async function fetchTasks() {
        const response = await fetch(ENDPOINTS.TASKS, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const tasks = await response.json();
        return tasks.filter(task => task.assignedTo === username);
    }

    // Update stats cards
    function updateStats(tasks) {
        const today = new Date().toISOString().slice(0, 10);
        const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
        const completedToday = tasks.filter(t => t.status === 'COMPLETED')
        //   && t.completedDate && t.completedDate.startsWith(today));
        document.getElementById('activeTasksCount').textContent = activeTasks.length;
        document.getElementById('completedTasksCount').textContent = completedToday.length;
        // You can add more logic for hours worked and performance if you have that data
    }

    // Update My Tasks list
    function updateMyTasks(tasks) {
        const list = document.getElementById('tasksList');
        if (!list) return;
        if (tasks.length === 0) {
            list.innerHTML = '<p class="text-muted">No tasks assigned.</p>';
            return;
        }
        list.innerHTML = tasks.map(task => `
            <div class="task-item mb-2 p-2 border rounded">
                <strong>${task.title}</strong>
                <span class="badge bg-${task.status === 'COMPLETED' ? 'success' : (task.status === 'IN_PROGRESS' ? 'primary' : 'warning')} ms-2">${task.status}</span>
                <div class="small text-muted">Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
            </div>
        `).join('');
    }

    function updateTaskProgressOverview(tasks) {
        const total = tasks.length || 1; // avoid division by zero
        const completed = tasks.filter(t => t.status === 'COMPLETED').length;
        const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const pending = tasks.filter(t => t.status === 'PENDING').length;
    
        document.getElementById('taskProgressOverview').innerHTML = `
            <div class="mb-2">Completed <span class="float-end">${completed}</span></div>
            <div class="progress mb-3">
                <div class="progress-bar bg-success" style="width: ${(completed/total)*100}%"></div>
            </div>
            <div class="mb-2">In Progress <span class="float-end">${inProgress}</span></div>
            <div class="progress mb-3">
                <div class="progress-bar bg-primary" style="width: ${(inProgress/total)*100}%"></div>
            </div>
            <div class="mb-2">Pending <span class="float-end">${pending}</span></div>
            <div class="progress">
                <div class="progress-bar bg-warning" style="width: ${(pending/total)*100}%"></div>
            </div>
        `;
    }

    // Main logic
    const tasks = await fetchTasks();
    updateStats(tasks);
    updateMyTasks(tasks);
    updateTaskProgressOverview(tasks);
    document.getElementById('welcomeName').textContent = username || 'Employee';
});
