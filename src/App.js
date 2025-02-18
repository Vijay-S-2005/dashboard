import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import ChangePassword from "./Pages/ChangePassword";
import About from "./Pages/About";
import Help from "./Pages/Help";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import "./Styles/App.css";
import { Navigate } from "react-router-dom";
import User from "./Pages/User";
import AdminRoute from "./Layouts/AdminRoute";
import LoginRouter from "./Layouts/LoginRouter";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<LoginRouter />}>
            <Route path="/" element={<Login />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/user" element={<User />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
