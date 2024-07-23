// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./ChangePassword";
import About from "./About";
import Help from "./Help";
import Dashboard from "./Dashboard";
import Login from "./Login";
import "./App.css";
import { Navigate } from "react-router-dom";
import User from "./User";
import AdminRoute from "./AdminRoute";
import LoginRouter from "./LoginRouter";




const App = () => {
  return (
    <Router>
      <div>
        <Routes>

          <Route element={<LoginRouter />}>
            <Route path="/" element={<Login />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route element={<AdminRoute/>}>
            <Route path="/user" element={<User/>} />
          </Route>



          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
