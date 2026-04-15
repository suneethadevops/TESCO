// Authentication Module
class User {
    constructor(id, email, password, firstName, lastName) {
        this.id = id;
        this.email = email;
        this.password = this.hashPassword(password); // Simple hash for demo
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdAt = new Date();
    }

    // Simple password hashing (for demo purposes only)
    hashPassword(password) {
        // In a real application, use proper hashing like bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Verify password
    verifyPassword(password) {
        return this.hashPassword(password) === this.password;
    }

    // Get user profile (without password)
    getProfile() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            createdAt: this.createdAt
        };
    }
}

// Authentication Manager
class AuthManager {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.loadUsers();
        this.loadSession();
    }

    // Load users from localStorage
    loadUsers() {
        const savedUsers = localStorage.getItem('tescoUsers');
        if (savedUsers) {
            const usersData = JSON.parse(savedUsers);
            this.users = usersData.map(userData => {
                const user = new User(
                    userData.id,
                    userData.email,
                    '', // Password not stored in plain text
                    userData.firstName,
                    userData.lastName
                );
                user.password = userData.password; // Restore hashed password
                user.createdAt = new Date(userData.createdAt);
                return user;
            });
        }
    }

    // Save users to localStorage
    saveUsers() {
        const usersData = this.users.map(user => ({
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt
        }));
        localStorage.setItem('tescoUsers', JSON.stringify(usersData));
    }

    // Load current session
    loadSession() {
        const session = localStorage.getItem('tescoSession');
        if (session) {
            const sessionData = JSON.parse(session);
            const user = this.users.find(u => u.id === sessionData.userId);
            if (user) {
                this.currentUser = user;
            }
        }
    }

    // Save current session
    saveSession() {
        if (this.currentUser) {
            const sessionData = {
                userId: this.currentUser.id,
                loginTime: new Date()
            };
            localStorage.setItem('tescoSession', JSON.stringify(sessionData));
        } else {
            localStorage.removeItem('tescoSession');
        }
    }

    // Register new user
    register(email, password, firstName, lastName) {
        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            throw new Error('User with this email already exists');
        }

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            throw new Error('All fields are required');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Create new user
        const id = Date.now().toString();
        const newUser = new User(id, email, password, firstName, lastName);
        this.users.push(newUser);
        this.saveUsers();

        return newUser.getProfile();
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.verifyPassword(password)) {
            throw new Error('Invalid password');
        }

        this.currentUser = user;
        this.saveSession();

        return user.getProfile();
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.saveSession();
        return true;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser ? this.currentUser.getProfile() : null;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        if (updates.firstName) this.currentUser.firstName = updates.firstName;
        if (updates.lastName) this.currentUser.lastName = updates.lastName;
        if (updates.email) {
            // Check if email is already taken
            if (this.users.find(u => u.email === updates.email && u.id !== this.currentUser.id)) {
                throw new Error('Email already in use');
            }
            this.currentUser.email = updates.email;
        }

        this.saveUsers();
        return this.currentUser.getProfile();
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        if (!this.currentUser.verifyPassword(currentPassword)) {
            throw new Error('Current password is incorrect');
        }

        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
        }

        this.currentUser.password = this.currentUser.hashPassword(newPassword);
        this.saveUsers();
        return true;
    }

    // Get all users (admin function)
    getAllUsers() {
        return this.users.map(user => user.getProfile());
    }

    // Delete user account
    deleteAccount() {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const index = this.users.findIndex(u => u.id === this.currentUser.id);
        if (index > -1) {
            this.users.splice(index, 1);
            this.saveUsers();
            this.logout();
            return true;
        }
        return false;
    }
}

// Initialize authentication manager
const auth = new AuthManager();

// Add some sample users for demo
try {
    auth.register('user@tesco.com', 'password123', 'John', 'Doe');
    auth.register('admin@tesco.com', 'admin123', 'Admin', 'User');
} catch (e) {
    // Users might already exist
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        User,
        AuthManager,
        auth
    };
}
