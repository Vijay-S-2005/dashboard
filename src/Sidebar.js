// src/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';


function Sidebar({ isOpen, toggleSidebar }) {
  let user_data = JSON.parse(localStorage.getItem('user_data'));
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user_data');
    navigate('/');
  }
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>
      <nav>
        <ul>
          <li><Link to="/dashboard"><button >Dashboard</button></Link></li>
          <li><Link to="/home"><button>Change Password</button></Link></li>
          {(user_data?.role === 'admin') ?<li><Link to="/user"><button>Manage User</button></Link></li>:null}
          <li><Link to="/about"><button >About</button></Link></li>
          <li><Link to="/help"><button>Help</button></Link></li>
          <li><button onClick={handleLogout}>Sign Out</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;




