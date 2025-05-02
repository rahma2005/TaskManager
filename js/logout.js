window.AuthService = {
    logout: function() {
        localStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
    }
};