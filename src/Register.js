import React, { useState } from "react";
import "./Register.css";
import axios from "axios";

export default function Register() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    userName: "",
    password: "",
    email: "",
    mobile: "",
    age: ""
  });

  const [userId, setUserId] = useState("");

  const update = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    console.log("dataaaa",userData);

    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", userData);
      console.log(response.data);
      setUserId(response.data.id);
    } catch (error) {
      console.log('error occurred', error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          First Name:
          <input type="text" name="firstName" value={userData.firstName} onChange={update} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={userData.lastName} onChange={update} />
        </label>
        <label>
          Gender:
          <select name="gender" value={userData.gender} onChange={update}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Username:
          <input type="text" name="userName" value={userData.userName} onChange={update} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={userData.password} onChange={update} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={update} />
        </label>
        <label>
          Mobile:
          <input type="tel" name="mobile" value={userData.mobile} onChange={update} />
        </label>
        <label>
          Age:
          <input type="number" name="age" value={userData.age} onChange={update} />
        </label>
        <button type="submit">Register</button>
      </form>
        {userId && <p>Your User ID is: {userId}</p>}
    </div>
  );
}
