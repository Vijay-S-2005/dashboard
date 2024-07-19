import React, { useEffect, useState } from "react";
import "./User.css";
import axios from "axios";

export default function CreateUser() {
  // const [errors, setErrors] = useState({});
  const [getUserData, setGetUserData] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    userName: "",
    email: "",
    mobile: "",
    age: ""
  });


  // const validate=()=>{
  //   let errors={};

  // }


  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value.trim()
    });
    console.log(userData);  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("dataaaa", userData);
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", userData);
      console.log(response.data);
    } catch (error) {
      console.log('error occurred', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_user_data");
        setGetUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log('error occurred', error);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="register-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Age</th>
            <th>Username</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(getUserData) && getUserData.map((user, index) => (
            <tr key={index}>
              <td>{user.firstName}</td> 
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.age}</td>
              <td>{user.userName}</td>
              <td>{user.gender}</td>
              {/* <td>{<button onClick={()=>setFormData()}>Edit</button>}</td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create User</h2>
        <label>
          First Name:
          <input type="text" name="firstName" value={userData.firstName} onChange={handleUpdate} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={userData.lastName} onChange={handleUpdate} />
        </label>
        <label>
          Gender:
          <select name="gender" value={userData.gender} onChange={handleUpdate}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Username:
          <input type="text" name="userName" value={userData.userName} onChange={handleUpdate} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={handleUpdate} />
        </label>
        <label>
          Mobile:
          <input type="tel" name="mobile" value={userData.mobile} onChange={handleUpdate} />
        </label>
        <label>
          Age:
          <input type="number" name="age" value={userData.age} onChange={handleUpdate} />
        </label>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
