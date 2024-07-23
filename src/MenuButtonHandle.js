import React from 'react';
import Sidebar from './Sidebar';
import {useState} from 'react';


export default function MenuButtonHandle() {
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
    </div>

  );
}