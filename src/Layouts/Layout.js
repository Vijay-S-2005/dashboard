// layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Heading from "../Components/Heading";  // Updated path
import Login from "../Pages/Login";
import MenuButtonHandle from "../Components/MenuButtonHandle";  // Updated path
const Layout = () => {
  return (
    <div>
      {localStorage.getItem("user_data") && <MenuButtonHandle />}
      <header>
        <Heading heading={"Chennai Traffic Visualization"} />
        {localStorage.getItem("user_data") ? <Outlet /> : <Login />}
        {/* {localStorage.getItem('session_id') ? <Outlet/> : <Login/>} */}
      </header>
      <main></main>
    </div>
  );
};

export default Layout;
