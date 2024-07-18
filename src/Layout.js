// layout.js
import React , {useState}from 'react';
import { Outlet } from 'react-router-dom';
import Heading from './Heading';
import Sidebar from './Sidebar';
import Login from './Login';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div>
    <button className="menu-btn" onClick={toggleSidebar}>
        ☰
    </button>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <header>
        <Heading/>
      </header>
      <main>
        {localStorage.getItem('session_id') ? <Outlet/> : <Login/>}
        
        
      </main>
    </div>
  );
};

export default Layout;