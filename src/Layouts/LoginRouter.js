import React from "react";
import { Outlet } from "react-router-dom";
import Login from "../Pages/Login";
import Heading from "../Components/Heading";  // Updated path

export default function LoginRouter() {
  return (
    <div>
      <Heading heading={"Chennai Traffic Visualization"} />

      <Outlet />
      {console.log(localStorage.getItem("user_data"))}
      {/* {localStorage.getItem('session_id') ? <Outlet/> : <Login/>} */}
    </div>
  );
}
