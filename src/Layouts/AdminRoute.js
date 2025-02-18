import React from "react";
import Heading from "../Components/Heading";  // Updated path
import { Outlet, Navigate } from "react-router-dom";
import MenuButtonHandle from "../Components/MenuButtonHandle";  // Updated path
const AdminRoute = () => {
  const user_data = JSON.parse(localStorage.getItem("user_data"));
  console.log("AdminRoute");
  return (
    <div>
      <MenuButtonHandle />
      <header>
        <Heading heading={"Chennai Traffic Visualization"} />
      </header>
      {user_data && user_data.role === "admin" ? (
        <Outlet />
      ) : (
        <Navigate to="/dashboard" />
      )}
    </div>
  );
};

export default AdminRoute;
