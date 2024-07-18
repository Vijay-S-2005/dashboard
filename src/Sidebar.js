// src/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';


function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('session_id');
    navigate('/');
  }
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>
      <nav>
        <ul>
          <li><Link to="/home"><button onClick={() => console.log('Home clicked')}>Home</button></Link></li>
          <li><Link to="/dashboard"><button onClick={() => console.log('Dashboard clicked')}>Dashboard</button></Link></li>
          <li><Link to="/about"><button onClick={() => console.log('About clicked')}>About</button></Link></li>
          <li><Link to="/help"><button onClick={() => console.log('Help clicked')}>Help</button></Link></li>
          <li><button onClick={handleLogout}>Sign Out</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;



