// Function to decode JWT token and get user data
function getUserDataFromToken() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Function to fetch and update user data
async function updateUserData() {
    const token = localStorage.getItem('jwtToken');
    const userData = getUserDataFromToken();
    
    if (!userData || !token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch user data from API
        const response = await fetch(ENDPOINTS.USER_PROFILE(userData.sub), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await response.json();
        
        // Update UI elements
        const userNameElements = document.querySelectorAll('#userName, #welcomeName');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = user.name || user.username;
            }
        });

        return user;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Initialize user data when the page loads
document.addEventListener('DOMContentLoaded', updateUserData); 