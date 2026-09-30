import React from 'react';
import './Navbar.css';

function Navbar({ userName, onLogout, onNavigate, publicMode = false, onOpenAuth, onBecomeNeighbor, role = 'customer', currentPage = 'home' }) {
  if (publicMode) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <h1 className="navbar-brand">NGHBR</h1>
          </div>

          <div className="navbar-center">
            <button className="nav-link active" onClick={() => onNavigate?.('home')}>
              Home
            </button>
            <button className="nav-link" onClick={() => onOpenAuth?.('login')}>
              Sign in
            </button>
            <button className="nav-link" onClick={() => onOpenAuth?.('register')}>
              Sign up
            </button>
            <button className="neighbor-btn" onClick={onBecomeNeighbor}>
              Become a Neighbor
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-brand">NGHBR</h1>
        </div>
        
        <div className="navbar-center">
          <button className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            {role === 'tasker' ? 'Home' : 'Book a Star'}
          </button>
          {role === 'tasker' ? (
            <>
              <button className={`nav-link ${currentPage === 'pending' ? 'active' : ''}`} onClick={() => onNavigate('pending')}>Pending Requests</button>
              <button className={`nav-link ${currentPage === 'confirmed' ? 'active' : ''}`} onClick={() => onNavigate('confirmed')}>Confirmed Requests</button>
            </>
          ) : (
            <button className={`nav-link ${currentPage === 'stars' ? 'active' : ''}`} onClick={() => onNavigate('stars')}>My Tasks</button>
          )}
          <button className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
            Profile
          </button>
        </div>

        <div className="navbar-right">
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
