import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toast } from "bootstrap";

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    userName: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user_data")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handlePassword = () => {
    navigate("/forgotpassword");
  }

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const validate = () => {
    let errors = true;
    if (!loginData.userName) {
      errors = false;
      toast.error("Username is required", { position: "top-right" });
    }

    if (!loginData.password) {
      errors = false;
      toast.error("Password is required", { position: "top-right" });
    }

    return errors;
  };

  const login = async () => {
    try {
      const responseRecieve = await axios.get(`http://127.0.0.1:5000/get_user_data?user_name=${loginData.userName}`);
      const responseSend = await axios.post("http://127.0.0.1:5000/login", loginData);
      console.log("send", responseSend.data);
      localStorage.setItem("user_data", JSON.stringify(responseRecieve.data));
      navigate("/dashboard");
    } catch (error) {
      setMessage("Invalid Username or Password");
      toast.error("Invalid Username or Password", { position: "top-right" });
      console.log("Error occurred during login:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validate()){
      login();
    }
    else{
      console.log("error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <label>
          Username:
          <input
            type="text"
            name="userName"
            value={loginData.userName}
            onChange={handleUpdate}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleUpdate}
          />
        </label>
        
        <button type="submit" className="submit-button" onClick={handleSubmit}>Login</button>
        {/* <button className="forgot-password-link" onClick={handlePassword}>Forgot password?</button> */}
        <a className="forgot-password-link" onClick={handlePassword}>Forgot Password</a>
      </form>
      {/* {message && <p>{message}</p>} */}
      <ToastContainer />
    </div>
  );
}
