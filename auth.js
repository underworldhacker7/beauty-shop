// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
    apiKey: "AIzaSyC5eyBjpVFpGU4rMNackwl0aVULbq5URNE",
    authDomain: "beauty-shop-e7176.firebaseapp.com",
    projectId: "beauty-shop-e7176",
    storageBucket: "beauty-shop-e7176.firebasestorage.app",
    messagingSenderId: "221917266718",
    appId: "1:221917266718:web:98c3d1f330b512b8cc7f0f",
    databaseURL: "https://beauty-shop-e7176-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// ==================== DOM ELEMENTS ====================
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const messageContainer = document.getElementById('message-container');

// ==================== HELPER FUNCTIONS ====================
function showMessage(message, type = 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}-message`;
    messageDiv.style.cssText = `
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        ${type === 'error' ?
            'background: rgba(255, 68, 68, 0.1); color: #ff4444; border: 1px solid #ff4444;' :
            'background: rgba(0, 200, 81, 0.1); color: #00C851; border: 1px solid #00C851;'
        }
    `;
    messageDiv.textContent = message;
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function redirectToOrders() {
    window.location.href = 'order.html';
}

// ==================== CHECK DATABASE ACCESS ====================
function checkDatabaseAccess() {
    // Just log a warning about database rules
    console.warn('Current database rules are set to false. User data will not be saved to database.');
}

// Run check
checkDatabaseAccess();

// ==================== AUTH FUNCTIONS ====================

// SIGN UP FUNCTION
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const signupBtn = document.getElementById('signup-btn');

    if (!name || !email || !password || !confirm) {
        showMessage('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters');
        return;
    }

    if (password !== confirm) {
        showMessage('Passwords do not match');
        return;
    }

    setLoading(signupBtn, true);

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await user.updateProfile({
            displayName: name
        });

        // Try to save to database, but handle permission denied gracefully
        try {
            await firebase.database().ref('users/' + user.uid).set({
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                address: '',
                phone: ''
            });
            console.log('User data saved to database');
        } catch (dbError) {
            if (dbError.code === 'PERMISSION_DENIED') {
                console.warn('Database permission denied. This is expected with current rules.');
                // Show a non-blocking warning
                showMessage('Note: Database access is restricted. Your account was created but some features may be limited.', 'success');
            } else {
                console.warn('Database save failed:', dbError);
            }
        }

        showMessage('Account created successfully! Redirecting to orders...', 'success');

        localStorage.setItem('userSignedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', user.uid);

        const token = await user.getIdToken();
        localStorage.setItem('token', token);

        setTimeout(() => {
            redirectToOrders();
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Signup failed. ';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email already in use. Please login instead.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak.';
                break;
            default:
                errorMessage += error.message;
        }

        showMessage(errorMessage);
    } finally {
        setLoading(signupBtn, false);
    }
});

// LOGIN FUNCTION
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const loginBtn = document.getElementById('login-btn');

    if (!email || !password) {
        showMessage('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address');
        return;
    }

    setLoading(loginBtn, true);

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        let userName = user.displayName || 'User';

        // Try to get user data from database, handle permission denied
        try {
            const snapshot = await firebase.database().ref('users/' + user.uid).once('value');
            const userData = snapshot.val();
            if (userData && userData.name) {
                userName = userData.name;
            }
        } catch (dbError) {
            if (dbError.code === 'PERMISSION_DENIED') {
                console.warn('Database permission denied. Using auth displayName only.');
            } else {
                console.warn('Database read failed:', dbError);
            }
        }

        showMessage('Login successful! Redirecting to orders...', 'success');

        localStorage.setItem('userSignedIn', 'true');
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);

        const token = await user.getIdToken();
        localStorage.setItem('token', token);

        setTimeout(() => {
            redirectToOrders();
        }, 2000);

    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'User not found. Please sign up.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'This account has been disabled.';
                break;
            default:
                errorMessage += error.message;
        }

        showMessage(errorMessage);
    } finally {
        setLoading(loginBtn, false);
    }
});

// ==================== TOGGLE FORMS ====================
showSignup.addEventListener('click', function (e) {
    e.preventDefault();
    loginSection.style.display = 'none';
    signupSection.style.display = 'block';
    messageContainer.innerHTML = '';
});

showLogin.addEventListener('click', function (e) {
    e.preventDefault();
    signupSection.style.display = 'none';
    loginSection.style.display = 'block';
    messageContainer.innerHTML = '';
});

// ==================== CHECK AUTH STATE ====================
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('User already signed in:', user.email);

        localStorage.setItem('userSignedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', user.displayName || 'User');

        user.getIdToken().then(token => {
            localStorage.setItem('token', token);
        });

        // Uncomment to auto-redirect signed-in users
        if (window.location.pathname.includes('signout.html') || window.location.pathname.includes('signout')) {
            window.location.href = 'order.html';
        }
    }
});

// ==================== PASSWORD VALIDATION ====================
const passwordInput = document.getElementById('signup-password');
const confirmInput = document.getElementById('signup-confirm');

if (passwordInput && confirmInput) {
    confirmInput.addEventListener('input', function () {
        if (this.value !== passwordInput.value) {
            this.style.borderColor = '#ff4444';
        } else {
            this.style.borderColor = '#00C851';
        }
    });

    passwordInput.addEventListener('input', function () {
        if (confirmInput.value && this.value !== confirmInput.value) {
            confirmInput.style.borderColor = '#ff4444';
        } else if (confirmInput.value) {
            confirmInput.style.borderColor = '#00C851';
        }
    });
}

// ==================== ADD LOADING STYLES ====================
const style = document.createElement('style');
style.textContent = `
    .btn.loading {
        position: relative;
        pointer-events: none;
        opacity: 0.7;
    }
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);