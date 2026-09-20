import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Homepage from './Homepage';
import './App.css';

export function AppRouter() {
    const [currentScreen, setCurrentScreen] = useState('homepage');
    const [initialAuthMode, setInitialAuthMode] = useState('login');

    const goToAuth = (mode = 'login') => {
        setInitialAuthMode(mode);
        setCurrentScreen('auth');
    };

    if (currentScreen === 'homepage') {
        return <Homepage onOpenAuth={goToAuth} />;
    }

    return (
        <App
            initialAuthMode={initialAuthMode}
            onBackHome={() => setCurrentScreen('homepage')}
        />
    );
}

function App({ initialAuthMode = 'login', onBackHome }) {
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    
    // Original input state variables
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    
    // Application flow state
    const [message, setMessage] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    
    // Authentication mode state
    const [authMode, setAuthMode] = useState(initialAuthMode); // Options: 'register' or 'login'
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    useEffect(() => {
        setAuthMode(initialAuthMode);
    }, [initialAuthMode]);
    
    // Load Square SDK
    useEffect(() => {
        // Only load if not already loaded
        if (!window.Square) {
            const squareScript = document.createElement('script');
            squareScript.src = process.env.NODE_ENV === 'production' 
                ? 'https://web.squarecdn.com/v1/square.js'
                : 'https://sandbox.web.squarecdn.com/v1/square.js';
            squareScript.async = true;
            squareScript.onload = () => {
                console.log('Square SDK loaded successfully');
            };
            squareScript.onerror = () => {
                console.error('Failed to load Square SDK');
            };
            document.head.appendChild(squareScript);
            
            return () => {
                // Clean up on component unmount
                if (document.head.contains(squareScript)) {
                    document.head.removeChild(squareScript);
                }
            };
        }
    }, []);
    
    // Add body class for dashboard view when verified
    useEffect(() => {
        if (isVerified) {
            document.body.classList.add('dashboard-view');
        } else {
            document.body.classList.remove('dashboard-view');
        }
        
        // Cleanup on component unmount
        return () => {
            document.body.classList.remove('dashboard-view');
        };
    }, [isVerified]);
    
    // ==========================================
    // EVENT HANDLERS
    // ==========================================
    
    const handleCapsLockDetection = (e) => {
        const isCaps = e.getModifierState('CapsLock');
        setIsCapsLockOn(isCaps);
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();

        // Email validation
       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
}

        try {
            const response = await axios.post('/register', {
                name: `${firstname} ${lastname}`.trim(),
                firstname,
                lastname,
                phone,
                location,
                email,
                password,
            });
            console.log("Registration API response:", response);
            setMessage(response.data.message || 'Verification code sent to your email!');
            setIsEmailSent(true); // Show verification step
        } catch (error) {
            setMessage('Error during registration: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/login', { email, password });
            console.log("Login API response:", response);
            
            if (response.data.success) {
                const userMetadata = response.data.user?.user_metadata || {};
                setName(response.data.name || userMetadata.name || 'User');
                setProfile({
                    name: response.data.name || userMetadata.name || 'User',
                    firstname: userMetadata.firstname || '',
                    lastname: userMetadata.lastname || '',
                    phone: userMetadata.phone || '',
                    location: userMetadata.location || '',
                    email,
                });
                setMessage('Login successful!');
                setIsVerified(true); 
            } else {
                setMessage(response.data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setMessage('Error during login: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleVerifyEmail = async () => {
        // Verification via code is not currently used — keep as a no-op placeholder.
        setMessage('Please check your email and click the verification link sent to you.');
    };

    const handleLogout = () => {
        // Reset all states
        setName('');
        setProfile({});
        setEmail('');
        setPassword('');
        setMessage('');
        setVerificationCode('');
        setIsEmailSent(false);
        setIsVerified(false);
        setAuthMode('login'); // Switch to login mode for next time
    };

    // ==========================================
    // COMPONENT RENDERING FUNCTIONS
    // ==========================================
    
    const renderLoginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleCapsLockDetection}
                    onKeyUp={handleCapsLockDetection}
                    required
                />
                {isCapsLockOn && (
                    <p className="caps-lock-warning">⚠️ Caps Lock is ON</p>
                )}
            </div>
            <button type="submit">Login</button>
        </form>
        
    );

    const renderRegistrationForm = () => (
        <form onSubmit={handleRegister}>
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Phone Number</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Location in Nairobi</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} required>
                    <option value="">Select your area</option>
                    <option value="Nairobi CBD">Nairobi CBD</option>
                    <option value="Westlands">Westlands</option>
                    <option value="Kilimani">Kilimani</option>
                    <option value="Kileleshwa">Kileleshwa</option>
                    <option value="Lavington">Lavington</option>
                    <option value="Karen">Karen</option>
                    <option value="Kasarani">Kasarani</option>
                    <option value="Roysambu">Roysambu</option>
                    <option value="Embakasi">Embakasi</option>
                    <option value="Lang'ata">Lang'ata</option>
                    <option value="Dagoretti">Dagoretti</option>
                    <option value="Other Nairobi area">Other Nairobi area</option>
                </select>
            </div>
            
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleCapsLockDetection}
                    onKeyUp={handleCapsLockDetection}
                    required
                />
                {isCapsLockOn && (
                    <p className="caps-lock-warning">⚠️ Caps Lock is ON</p>
                )}
            </div>
            <button type="submit">Register</button>
        </form>
    );

    const renderVerificationForm = () => (
        <div className="verification-confirmation">
            <h2>Check your email</h2>
            <p>Please click the verification link we sent to your inbox to activate your account.</p>
            <button onClick={() => { setIsEmailSent(false); setAuthMode('login'); setMessage('You can now log in after verifying via email.'); }}>Back to Login</button>
        </div>
    );

    // ==========================================
    // MAIN RENDER FUNCTION
    // ==========================================
    return (
        <div className={`App ${isVerified ? 'dashboard-mode' : ''}`}>
            {!isVerified ? (
                <>
                    {onBackHome && (
                        <button
                            type="button"
                            className="back-home-link"
                            onClick={onBackHome}
                            style={{ marginBottom: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}
                        >
                            ← Back to homepage
                        </button>
                    )}
                    <h1>Welcome to TaskBoy</h1>
                    
                    {isEmailSent ? (
                        renderVerificationForm()
                    ) : (
                        <>
                            <div className="auth-tabs">
                                <button 
                                    className={`tab-btn ${authMode === 'register' ? 'active' : ''}`}
                                    onClick={() => setAuthMode('register')}
                                >
                                    Register
                                </button>
                                <button 
                                    className={`tab-btn ${authMode === 'login' ? 'active' : ''}`}
                                    onClick={() => setAuthMode('login')}
                                >
                                    Login
                                </button>
                            </div>
                            
                            {authMode === 'register' ? renderRegistrationForm() : renderLoginForm()}
                        </>
                    )}
                    
                    {message && <p className="message">{message}</p>}
                </>
            ) : (
                <Dashboard
                    name={name}
                    email={email}
                    profile={profile}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default AppRouter;