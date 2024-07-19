import React,{useState}from 'react';
import Sidebar from './Sidebar';
import Heading from './Heading';
import { Outlet,Navigate } from 'react-router-dom';

const AdminRoute = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    console.log('AdminRoute')
    return (
        <div>
    <button className="menu-btn" onClick={toggleSidebar}>
        ☰
    </button>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <header>
        <Heading/>
      </header>
    {localStorage.getItem('role')==='admin' ? <Outlet /> : <Navigate to="/dashboard" />}

    </div>

    )
    
};



export default AdminRoute;