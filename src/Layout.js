// layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Heading from './Heading';
import Login from './Login';
import MenuButtonHandle from './MenuButtonHandle';
const Layout = () => {


  return (
    <div>
    <MenuButtonHandle/>
      <header>
      <Heading heading={"Chennai Traffic Visualization"}/>
      {localStorage.getItem('user_data') ? <Outlet/> : <Login/>}
      {/* {localStorage.getItem('session_id') ? <Outlet/> : <Login/>} */}
      </header>
      <main>
        
        
        
      </main>
    </div>
  );
};

export default Layout;