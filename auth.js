document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username') || '';
    
    // Create auth container if it doesn't exist
    if (!document.getElementById('authContainer')) {
        const navUl = document.querySelector('nav ul');
        const authLi = document.createElement('li');
        authLi.id = 'authContainer';
        
        // Set initial button state based on login status
        if (isLoggedIn) {
            authLi.innerHTML = `<a href="#" id="logoutBtn">Logout (${username})</a>`;
        } else {
            authLi.innerHTML = '<a href="#" id="loginBtn">Login</a>';
        }
        
        navUl.appendChild(authLi);
    }
    
    // Create modal container if it doesn't exist
    if (!document.getElementById('authModal')) {
        const modalHTML = `
            <div id="authModal" class="auth-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalTitle">Login</h2>
                        <button class="close-btn" id="closeAuthModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="loginForm">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" id="username" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" required>
                            </div>
                            <div class="form-actions">
                                <button type="button" id="submitLoginBtn" class="btn-primary">Login</button>
                                <p class="auth-links">Belum punya akun? <a href="#" id="showRegisterLink">Daftar</a></p>
                            </div>
                        </div>
                        <div id="registerForm" style="display: none;">
                            <div class="form-group">
                                <label for="newUsername">Username</label>
                                <input type="text" id="newUsername" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">Password</label>
                                <input type="password" id="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Konfirmasi Password</label>
                                <input type="password" id="confirmPassword" required>
                            </div>
                            <div class="form-actions">
                                <button type="button" id="submitRegisterBtn" class="btn-primary">Daftar</button>
                                <p class="auth-links">Sudah punya akun? <a href="#" id="showLoginLink">Login</a></p>
                            </div>
                        </div>
                        <div id="logoutConfirm" style="display: none;">
                            <p>Apakah Anda yakin ingin keluar?</p>
                            <div class="form-actions">
                                <button type="button" id="confirmLogoutBtn" class="btn-primary">Ya, Logout</button>
                                <button type="button" id="cancelLogoutBtn" class="btn-secondary">Batal</button>
                            </div>
                        </div>
                        <div id="logoutSuccess" style="display: none;">
                            <p>Anda telah berhasil logout.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert modal HTML into body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add CSS styles for the modal
        const modalStyles = `
            <style>
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            
            .auth-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .auth-modal .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }
            
            .auth-modal .modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #0400ff, #9d50bb);
                color: white;
                border-radius: 12px 12px 0 0;
            }
            
            .auth-modal .modal-header h2 {
                margin: 0;
                font-size: 24px;
                text-align: center;
                flex-grow: 1;
            }
            
            .auth-modal .close-btn {
                background: none;
                border: none;
                font-size: 28px;
                color: white;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s;
            }
            
            .auth-modal .close-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .auth-modal .modal-body {
                padding: 30px 20px;
            }
            
            .auth-modal .form-group {
                margin-bottom: 20px;
            }
            
            .auth-modal .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
            }
            
            .auth-modal .form-group input {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            
            .auth-modal .form-group input:focus {
                border-color: #9d50bb;
                outline: none;
            }
            
            .auth-modal .form-actions {
                margin-top: 25px;
                text-align: center;
            }
            
            .auth-modal .btn-primary {
                padding: 12px 24px;
                background: linear-gradient(135deg, #0400ff, #9d50bb);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s;
            }
            
            .auth-modal .btn-primary:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }
            
            .auth-modal .btn-secondary {
                padding: 12px 24px;
                background: #f1f1f1;
                color: #333;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
                transition: all 0.3s;
            }
            
            .auth-modal .btn-secondary:hover {
                background: #e1e1e1;
            }
            
            .auth-modal .auth-links {
                margin-top: 20px;
                font-size: 14px;
                color: #666;
            }
            
            .auth-modal .auth-links a {
                color: #0400ff;
                text-decoration: none;
                font-weight: bold;
            }
            
            .auth-modal .auth-links a:hover {
                text-decoration: underline;
            }
            
            #authContainer a {
                background-color: rgba(255, 255, 255, 0.2);
                padding: 8px 16px;
                border-radius: 20px;
                color: white;
                align-items: center;
                text-decoration: none;
                transition: all 0.3s ease;
                display: flex;
            }
            
            #authContainer a:hover {
                background-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            </style>
        `;
        
        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
    
    // Get modal elements
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('closeAuthModal');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutConfirm = document.getElementById('logoutConfirm');
    const logoutSuccess = document.getElementById('logoutSuccess');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const submitRegisterBtn = document.getElementById('submitRegisterBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    
    // Function to show modal
    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        // Reset forms and views
        setTimeout(() => {
            if (isLoggedIn) {
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
                logoutConfirm.style.display = 'block';
                logoutSuccess.style.display = 'none';
            } else {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                logoutConfirm.style.display = 'none';
                logoutSuccess.style.display = 'none';
            }
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }, 300);
    }
    
    // Handle login click
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modalTitle.textContent = 'Login';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            logoutConfirm.style.display = 'none';
            logoutSuccess.style.display = 'none';
            showModal();
        });
    }
    
    // Handle logout click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modalTitle.textContent = 'Logout';
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            logoutConfirm.style.display = 'block';
            logoutSuccess.style.display = 'none';
            showModal();
        });
    }
    
    // Handle register link click
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        modalTitle.textContent = 'Daftar';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    
    // Handle login link click
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        modalTitle.textContent = 'Login';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
    
    // Handle login submit
    submitLoginBtn.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            // For demonstration, we'll accept any non-empty values
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Update UI
            document.getElementById('authContainer').innerHTML = `<a href="#" id="logoutBtn">Logout (${username})</a>`;
            
            // Reattach event listener to new logout button
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                modalTitle.textContent = 'Logout';
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
                logoutConfirm.style.display = 'block';
                logoutSuccess.style.display = 'none';
                showModal();
            });
            
            // Close modal
            closeModal();
            
            // Show success alert
            setTimeout(() => {
                alert(`Selamat datang, ${username}! Anda berhasil login.`);
            }, 300);
        } else {
            alert('Mohon isi username dan password');
        }
    });
    
    // Handle register submit
    submitRegisterBtn.addEventListener('click', function() {
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (username && email && password) {
            if (password !== confirmPassword) {
                alert('Password dan konfirmasi password tidak cocok!');
                return;
            }
            
            // For demonstration, we'll accept any valid input
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Update UI
            document.getElementById('authContainer').innerHTML = `<a href="#" id="logoutBtn">Logout (${username})</a>`;
            
            // Reattach event listener to new logout button
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                modalTitle.textContent = 'Logout';
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
                logoutConfirm.style.display = 'block';
                logoutSuccess.style.display = 'none';
                showModal();
            });
            
            // Close modal
            closeModal();
            
            // Show success alert
            setTimeout(() => {
                alert(`Selamat datang, ${username}! Akun Anda berhasil dibuat dan Anda telah login.`);
            }, 300);
        } else {
            alert('Mohon lengkapi semua data registrasi');
        }
    });
    
    // Handle confirm logout click
    confirmLogoutBtn.addEventListener('click', function() {
        // Clear login status
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        
        // Update UI
        document.getElementById('authContainer').innerHTML = '<a href="#" id="loginBtn">Login</a>';
        
        // Reattach event listener to new login button
        document.getElementById('loginBtn').addEventListener('click', function(e) {
            e.preventDefault();
            modalTitle.textContent = 'Login';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            logoutConfirm.style.display = 'none';
            logoutSuccess.style.display = 'none';
            showModal();
        });
        
        // Show logout success
        logoutConfirm.style.display = 'none';
        logoutSuccess.style.display = 'block';
        
        // Close modal after a delay
        setTimeout(() => {
            closeModal();
            // Show success alert
            setTimeout(() => {
                alert('Anda telah berhasil logout.');
            }, 300);
        }, 1500);
    });
    
    // Handle cancel logout click
    cancelLogoutBtn.addEventListener('click', closeModal);
    
    // Event listeners for closing modal
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});