import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostTaskForm from './PostTaskForm';
import TaskBookingModal from './TaskBookingModal';
import TaskerOnboarding from './TaskerOnboarding';
import Navbar from './Navbar';
import './Dashboard.css';

function Dashboard({ name, email, profile, onLogout }) {
    const [showForm, setShowForm] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [isOnboarded, setIsOnboarded] = useState(null); // null = unknown/loading
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [myTasksLoading, setMyTasksLoading] = useState(false);
    const [myTasksError, setMyTasksError] = useState('');
    const [profileSection, setProfileSection] = useState('account');
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [profileMessage, setProfileMessage] = useState('');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    const fetchTasks = async (query = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/tasks/search?query=${encodeURIComponent(query)}`);
            setTasks(response.data.tasks || []);
            setFilteredResults(response.data.tasks || []);
            setError('');
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Check whether this user has already onboarded as a Tasker (i.e. has a
    // Paystack subaccount on file). This determines whether "List a Service"
    // goes straight to the form or to onboarding first.
    useEffect(() => {
        const fetchOnboardingStatus = async () => {
            try {
                const response = await axios.get('/api/tasker/status', {
                    headers: { 'user-id': email }
                });
                setIsOnboarded(!!response.data.onboarded);
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setIsOnboarded(false);
            }
        };
        fetchOnboardingStatus();
    }, [email]);

    // Handle search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredResults(tasks);
            return;
        }

        const filtered = tasks.filter(task =>
            task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredResults(filtered);
    }, [searchQuery, tasks]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
    };

    // Decide what happens when "List a Service" / "Cancel" is clicked
    const handleListServiceClick = () => {
        if (showForm || showOnboarding) {
            setShowForm(false);
            setShowOnboarding(false);
            return;
        }
        if (isOnboarded) {
            setShowForm(true);
        } else {
            setShowOnboarding(true);
        }
    };

    // Load Paystack Inline SDK once when the component mounts.
    // Note: intentionally no cleanup/removal of the script tag — third-party
    // SDK scripts like this should persist for the page's lifetime. Removing
    // it on unmount races with React Strict Mode's double-invoke of effects
    // in development and can throw an opaque cross-origin "Script error."
    useEffect(() => {
        if (!window.PaystackPop && !document.querySelector('script[data-paystack]')) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v2/inline.js';
            script.async = true;
            script.dataset.paystack = 'true';
            script.onload = () => {
                console.log('Paystack SDK loaded');
            };
            script.onerror = () => {
                console.error('Failed to load Paystack SDK');
            };
            document.body.appendChild(script);
        }
    }, []);

    const renderPlaceholderContent = () => {
        const placeholders = [
            {
                id: 'placeholder-1',
                title: 'Assemble IKEA Bookshelf',
                category: 'furniture-assembly',
                location: 'Kilimani, Nairobi',
                price: '1500.00',
                imageURL: 'https://via.placeholder.com/300x200?text=Furniture+Assembly',
                description: 'PAX wardrobe or bookshelf assembly, tools included.'
            },
            {
                id: 'placeholder-2',
                title: 'Deep Clean 2-Bedroom Apartment',
                category: 'cleaning',
                location: 'Westlands, Nairobi',
                price: '3000.00',
                imageURL: 'https://via.placeholder.com/300x200?text=Cleaning',
                description: 'Full deep clean including kitchen and bathrooms.'
            },
            {
                id: 'placeholder-3',
                title: 'Help Moving Furniture',
                category: 'moving',
                location: 'Karen, Nairobi',
                price: '2000.00',
                imageURL: 'https://via.placeholder.com/300x200?text=Moving',
                description: 'An extra pair of hands for moving heavy items.'
            }
        ];

        return (
            <div className="listings-grid">
                {placeholders.map((item) => (
                    <div
                        key={item.id}
                        className="listing-card"
                        onClick={() => handleTaskClick(item)}
                    >
                        <img src={item.imageURL} alt={item.title} />
                        <div className="listing-info">
                            <h3>{item.title}</h3>
                            <p><strong>Category:</strong> {item.category}</p>
                            <p><strong>Location:</strong> {item.location}</p>
                            <p><strong>KES {item.price}</strong></p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setShowForm(false);
        setShowOnboarding(false);
        if (page === 'stars' && myTasks.length === 0) {
            fetchMyTasks();
        }
    };

    const fetchMyTasks = async () => {
        setMyTasksLoading(true);
        setMyTasksError('');
        try {
            const response = await axios.get('/api/profile/tasks', {
                headers: { 'user-id': email }
            });
            setMyTasks(response.data.tasks || []);
        } catch (error) {
            setMyTasksError(error.response?.data?.message || 'Could not load your tasks.');
        } finally {
            setMyTasksLoading(false);
        }
    };

    const renderMyTasks = () => {
        const currentTasks = myTasks.filter((task) => task.status !== 'completed');
        const completedTasks = myTasks.filter((task) => task.status === 'completed');

        const renderTaskList = (tasks, emptyMessage) => (
            tasks.length > 0 ? (
                <div className="my-task-list">
                    {tasks.map((task) => (
                        <div className="my-task-row" key={task.bookingId}>
                            <div>
                                <h3>{task.title || 'Untitled task'}</h3>
                                <p>{task.category || 'General task'}{task.location ? ` | ${task.location}` : ''}</p>
                            </div>
                            <div className="my-task-meta">
                                <strong>KES {task.amount || task.price || '0'}</strong>
                                <span>{task.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="profile-hint">{emptyMessage}</p>
        );

        return (
            <div className="stars-page">
                <h2>My Stars</h2>
                {myTasksLoading && <p className="profile-hint">Loading your tasks...</p>}
                {myTasksError && <p className="profile-message">{myTasksError}</p>}
                {!myTasksLoading && !myTasksError && (
                    <>
                        <section className="task-status-section">
                            <h3>Current Tasks</h3>
                            {renderTaskList(currentTasks, 'You have no current tasks.')}
                        </section>
                        <section className="task-status-section">
                            <h3>Completed Tasks</h3>
                            {renderTaskList(completedTasks, 'You have no completed tasks yet.')}
                        </section>
                    </>
                )}
            </div>
        );
    };

    const loadProfileSection = async (section) => {
        setProfileSection(section);
        setProfileMessage('');

        if (section === 'payment' && !paymentDetails) {
            try {
                const response = await axios.get('/api/profile/payment-details', {
                    headers: { 'user-id': email }
                });
                setPaymentDetails(response.data.payment || {});
            } catch (error) {
                setProfileMessage(error.response?.data?.message || 'Could not load payment details.');
            }
        }

        if (section === 'transactions' && transactions.length === 0) {
            try {
                const response = await axios.get('/api/profile/transactions', {
                    headers: { 'user-id': email }
                });
                setTransactions(response.data.transactions || []);
            } catch (error) {
                setProfileMessage(error.response?.data?.message || 'Could not load transaction history.');
            }
        }
    };

    const handlePasswordReset = async () => {
        try {
            const response = await axios.post('/api/profile/password-reset', { email });
            setProfileMessage(response.data.message || 'Password reset instructions sent to your email.');
        } catch (error) {
            setProfileMessage(error.response?.data?.message || 'Could not send password reset instructions.');
        }
    };

    const renderProfileContent = () => {
        if (profileSection === 'account') {
            return (
                <div className="profile-panel">
                    <h3>Account Information</h3>
                    <div className="profile-fields">
                        <p><strong>First name</strong><span>{profile?.firstname || name}</span></p>
                        <p><strong>Last name</strong><span>{profile?.lastname || 'Not provided'}</span></p>
                        <p><strong>Email</strong><span>{profile?.email || email}</span></p>
                        <p><strong>Phone</strong><span>{profile?.phone || 'Not provided'}</span></p>
                        <p><strong>Location</strong><span>{profile?.location || 'Not provided'}</span></p>
                    </div>
                </div>
            );
        }

        if (profileSection === 'password') {
            return (
                <div className="profile-panel">
                    <h3>Password</h3>
                    <p className="masked-value">********</p>
                    <p className="profile-hint">Your password is never displayed. Send yourself a secure reset link to change it.</p>
                    <button className="profile-action-btn" onClick={handlePasswordReset}>Email me a password reset link</button>
                </div>
            );
        }

        if (profileSection === 'payment') {
            return (
                <div className="profile-panel">
                    <h3>Payment Details</h3>
                    {showOnboarding ? (
                        <TaskerOnboarding
                            email={email}
                            onComplete={() => {
                                setIsOnboarded(true);
                                setShowOnboarding(false);
                                setPaymentDetails(null);
                                loadProfileSection('payment');
                            }}
                        />
                    ) : paymentDetails?.configured ? (
                        <>
                            <p><strong>Account holder</strong><span>{paymentDetails.businessName}</span></p>
                            <button className="profile-action-btn" onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
                                {showPaymentDetails ? 'Hide bank details' : 'Show bank details'}
                            </button>
                            {showPaymentDetails && <p className="revealed-payment"><strong>Bank account</strong><span>{paymentDetails.bankName || 'Bank account'} ending in {paymentDetails.accountNumberLast4}</span></p>}
                            <button className="profile-action-btn" onClick={() => setShowOnboarding(true)}>Update payment details</button>
                        </>
                    ) : (
                        <>
                            <p className="profile-hint">No payout account has been set up yet.</p>
                            <button className="profile-action-btn" onClick={() => setShowOnboarding(true)}>Set up payment details</button>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="profile-panel">
                <h3>Transaction History</h3>
                {transactions.length === 0 ? <p className="profile-hint">No transactions found.</p> : (
                    <div className="transaction-list">
                        {transactions.map((transaction) => (
                            <div className="transaction-row" key={transaction.id}>
                                <span>{transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'Date unavailable'}</span>
                                <strong>KES {transaction.amount}</strong>
                                <span className={`transaction-status ${transaction.status}`}>{transaction.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar userName={name} onLogout={onLogout} onNavigate={handleNavigate} />
            
            <div className="dashboard">
                {/* Profile Page */}
                {currentPage === 'profile' && (
                    <div className="profile-page">
                        <h2>My Profile</h2>
                        <div className="profile-layout">
                            <nav className="profile-sidebar" aria-label="Profile sections">
                                <button className={profileSection === 'account' ? 'active' : ''} onClick={() => loadProfileSection('account')}>Account Information</button>
                                <button className={profileSection === 'password' ? 'active' : ''} onClick={() => loadProfileSection('password')}>Password</button>
                                <button className={profileSection === 'payment' ? 'active' : ''} onClick={() => loadProfileSection('payment')}>Payment</button>
                                <button className={profileSection === 'transactions' ? 'active' : ''} onClick={() => loadProfileSection('transactions')}>Transaction History</button>
                            </nav>
                            <div className="profile-content">
                                {renderProfileContent()}
                                {profileMessage && <p className="profile-message">{profileMessage}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {currentPage === 'stars' && renderMyTasks()}

                {/* Home Page */}
                {currentPage === 'home' && (
                    <>
                        <h2>Welcome, {name}!</h2>

                        {/* Search Bar */}
                        <div className="search-section">
                            <input
                                type="text"
                                placeholder="Search by title, category, location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Toggle Post Service Form / Onboarding */}
            <button className="post-listing-btn" onClick={handleListServiceClick}>
                {(showForm || showOnboarding) ? "Cancel" : "List a Service"}
            </button>

            {/* Route to onboarding first if this Tasker hasn't set up payouts yet */}
            {showOnboarding && (
                <TaskerOnboarding
                    email={email}
                    onComplete={() => {
                        setIsOnboarded(true);
                        setShowOnboarding(false);
                        setShowForm(true);
                    }}
                />
            )}

            {showForm && (
                <PostTaskForm
                    email={email}
                    onClose={() => setShowForm(false)}
                    onTaskPosted={() => fetchTasks(searchQuery)}
                />
            )}

            {/* Tasks Grid */}
            {!showForm && !showOnboarding && (
                <>
                    {isLoading ? (
                        <p className="status-message">Loading tasks...</p>
                    ) : error ? (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            {renderPlaceholderContent()}
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="listings-grid">
                            {filteredResults.map((task) => (
                                <div
                                    key={task.id}
                                    className="listing-card"
                                    onClick={() => handleTaskClick(task)}
                                >
                                    <img
                                        src={task.imageURL || "https://via.placeholder.com/300x200?text=No+Image"}
                                        alt={task.title}
                                    />
                                    <div className="listing-info">
                                        <h3>{task.title}</h3>
                                        <p><strong>Category:</strong> {task.category}</p>
                                        <p><strong>Location:</strong> {task.location}</p>
                                        <p><strong>KES {task.price}</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchQuery ? (
                        <p className="status-message">No tasks matching "{searchQuery}" found.</p>
                    ) : (
                        <div>
                            <p className="status-message">No services listed yet. Be the first!</p>
                            {renderPlaceholderContent()}
                        </div>
                    )}
                    </>
                )}
                </>
                )}

                {/* Task Booking Modal */}
                {selectedTask && (
                    <TaskBookingModal
                        task={selectedTask}
                        onClose={handleCloseModal}
                        userEmail={email}
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard;
