import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate();



  const [loginData, setLoginData] = useState({
    userName: "",
    password: ""
  });


  
  const [message, setMessage] = useState("");
  // const location=useLocation();

  useEffect(() => {
    if (localStorage.getItem("user_data")) {
      navigate("/dashboard");
    }
  }, [navigate]);



  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseRecieve = await axios.get(`http://127.0.0.1:5000/get_user_data?user_name=${loginData.userName}`);
      const responseSend = await axios.post("http://127.0.0.1:5000/login", loginData);
      console.log("send", responseSend.data);
      localStorage.setItem("user_data", JSON.stringify(responseRecieve.data));
      // localStorage.setItem("session_id", responseSend.data.session);
      // localStorage.setItem("role", responseSend.data.role);

      navigate("/dashboard");
    } catch (error) {
      setMessage("Invalid Username or Password");
      console.log("Error occurred during login:", error);
    }
  };

  return (
    <div className="login-container">

      <form className="login-form" >
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
        <button type="submit" onClick={handleSubmit}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
