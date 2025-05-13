document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Get user role
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = 'login.html';
        return;
    }

    // Validate token and get user data
    function getLoggedInUser() {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                window.location.href = 'login.html';
                return null;
            }
            
            return payload.sub;
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            window.location.href = 'login.html';
            return null;
        }
    }

    const username = getLoggedInUser();
    if (!username) return;

    // Fetch user profile data from API
    async function fetchUserProfile() {
        try {
            const response = await fetch(ENDPOINTS.USER_PROFILE(username), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    // Update profile display with user data
    function updateProfileDisplay(userData) {
        // Update header and dropdown
        document.getElementById('userName').textContent = userData.name || userData.username;
        
        // Update profile header
        document.querySelector('.profile-header h2').textContent = userData.name || userData.username;
        
        // Update profile picture with new default
        const defaultProfilePic = 'images/profile.jpg';
        const profilePictures = document.querySelectorAll('.profile-image img, #userDropdown img');
        profilePictures.forEach(img => {
            img.src = userData.profilePicture || defaultProfilePic;
            // Add error handler to fallback to default if custom image fails to load
            img.onerror = function() {
                this.src = defaultProfilePic;
            };
        });
        
        // Update personal information
        document.querySelector('[data-field="email"]').textContent = userData.email;
        document.querySelector('[data-field="phone"]').textContent = userData.phone || 'Not set';
        document.querySelector('[data-field="birthDate"]').textContent = formatDate(userData.birthDate) || 'Not set';
        document.querySelector('[data-field="location"]').textContent = userData.location || 'Not set';
        
        // Update work information
        document.querySelector('[data-field="position"]').textContent = userData.position || 'Not set';
        document.querySelector('[data-field="joinDate"]').textContent = formatDate(userData.joinDate) || 'Not set';
        
        // Update skills
        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer && userData.skills) {
            skillsContainer.innerHTML = userData.skills
                .map(skill => `<span class="badge bg-light text-dark">${skill}</span>`)
                .join('');
        }
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // // Handle profile picture change
    // const changePhotoBtn = document.getElementById('changePhotoBtn');
    // if (changePhotoBtn) {
    //     changePhotoBtn.addEventListener('click', function() {
    //         const input = document.createElement('input');
    //         input.type = 'file';
    //         input.accept = 'image/*';
            
    //         input.onchange = async function(e) {
    //             const file = e.target.files[0];
    //             if (file) {
    //                 try {
    //                     // Convert file to base64
    //                     const base64 = await fileToBase64(file);
                        
    //                     // Update user profile with new picture
    //                     const response = await fetch(`http://localhost:8080/api/users/${username}`, {
    //                         method: 'PUT',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             'Authorization': `Bearer ${token}`
    //                         },
    //                         body: JSON.stringify({
    //                             profilePicture: base64
    //                         })
    //                     });

    //                     if (!response.ok) {
    //                         throw new Error('Failed to update profile picture');
    //                     }

    //                     const updatedUser = await response.json();
    //                     updateProfileDisplay(updatedUser);
    //                     showNotification('Profile picture updated successfully!');
    //                 } catch (error) {
    //                     console.error('Error updating profile picture:', error);
    //                     showNotification('Failed to update profile picture', 'error');
    //                 }
    //             }
    //         };
            
    //         input.click();
    //     });
    // }

    // Convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Handle edit profile form submission
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const updatedData = {
                name: document.getElementById('editName').value,
                phone: document.getElementById('editPhone').value,
                birthDate: document.getElementById('editDob').value,
                location: document.getElementById('editLocation').value,
                position: document.getElementById('editPosition').value,
                skills: document.getElementById('editSkills').value
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(skill => skill.length > 0)
            };

            try {
                const response = await fetch(ENDPOINTS.USER_PROFILE(username), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                const updatedUser = await response.json();
                updateProfileDisplay(updatedUser);
                
                // Close modal and show notification
                bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
                showNotification('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                showNotification('Failed to update profile', 'error');
            }
        });
    }

    // Initialize edit modal with user data
    function initializeEditModal(userData) {
        document.getElementById('editName').value = userData.name || '';
        document.getElementById('editPhone').value = userData.phone || '';
        document.getElementById('editDob').value = userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '';
        document.getElementById('editLocation').value = userData.location || '';
        document.getElementById('editPosition').value = userData.position || '';
        document.getElementById('editSkills').value = userData.skills ? userData.skills.join(', ') : '';
    }

    // Show notification helper
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Initialize profile
    const userData = await fetchUserProfile();
    if (userData) {
        updateProfileDisplay(userData);
        
        // Initialize edit modal when shown
        const editProfileModal = document.getElementById('editProfileModal');
        if (editProfileModal) {
            // Store userData in a variable accessible to the modal
            let currentUserData = userData;
            
            // Update currentUserData whenever profile is updated
            const updateCurrentUserData = (newData) => {
                currentUserData = newData;
            };
            
            editProfileModal.addEventListener('show.bs.modal', function() {
                // Always use the most recent user data
                initializeEditModal(currentUserData);
            });
            
            // Update the updateProfileDisplay function to also update currentUserData
            const originalUpdateProfileDisplay = updateProfileDisplay;
            updateProfileDisplay = function(userData) {
                originalUpdateProfileDisplay(userData);
                updateCurrentUserData(userData);
            };
        }
    }
});

window.AuthService = {
    logout: function() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
};