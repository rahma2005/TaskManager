// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = { email, password };

    // Send a POST request to the backend for login
    fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token && data.role) {
            // Store both token and role in local storage
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('userRole', data.role);
            // Redirect based on user role
            if (data.role === 'EMPLOYEE') {
                window.location.href = 'dashboard-employee.html';
            } else if (data.role === 'MANAGER') {
                window.location.href = 'dashboard-manager.html';
            }
        } else {
            // Display error message if login fails
            document.getElementById('errorMessage').textContent = 'Invalid credentials';
            document.getElementById('errorMessage').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
        document.getElementById('errorMessage').style.display = 'block';
    });
});

// AuthService for logout
window.AuthService = {
    logout: function() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole'); // Also remove the role when logging out
        window.location.href = 'login.html';
    }
};
