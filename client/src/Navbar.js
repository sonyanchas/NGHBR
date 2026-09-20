import React from 'react';
import './Navbar.css';

function Navbar({ userName, onLogout, onNavigate, publicMode = false, onOpenAuth }) {
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
            <button className="neighbor-btn" onClick={() => onOpenAuth?.('register')}>
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
          <button className="nav-link" onClick={() => onNavigate('home')}>
            Home
          </button>
          <button className="nav-link" onClick={() => onNavigate('stars')}>
            My Tasks
          </button>
          <button className="nav-link" onClick={() => onNavigate('profile')}>
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
