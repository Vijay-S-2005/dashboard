import React, { useEffect, useState } from "react";
import "../Styles/User.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateUser() {
  const [check, setCheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [getUserData, setGetUserData] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    userName: "",
    email: "",
    mobile: "",
    age: "",
  });

  const validate = () => {
    let errors = {};
    if (!userData.firstName) {
      errors.firstName = "First Name is required";
      toast.error("First Name is required", { position: "top-right" });
    }

    if (!userData.lastName) {
      errors.lastName = "Last Name is required";
      toast.error("Last Name is required", { position: "top-right" });
    }

    if (!userData.gender) {
      errors.gender = "Gender is required";
      toast.error("gender is required", { position: "top-right" });
    }

    if (!userData.userName) {
      errors.userName = "Username is required";
      toast.error("Username is required", { position: "top-right" });
    } else if (
      getUserData.some((user) => user.userName === userData.userName)
    ) {
      errors.userName = "Username already exists";
      toast.error("Username already exists", { position: "top-right" });
    }

    if (!userData.email) {
      errors.email = "Email is required";
      toast.error("Email is required", { position: "top-right" });
    }

    if (!userData.mobile) {
      errors.mobile = "Mobile is required";
      toast.error("Mobile is required", { position: "top-right" });
    } else if (userData.mobile.length !== 10) {
      errors.mobile = "Mobile number should be 10 digits";
      toast.error("Mobile number should be 10 digits", {
        position: "top-right",
      });
    } else if (!/^[0-9]+$/.test(userData.mobile)) {
      errors.mobile = "Mobile number should contain only digits";
      toast.error("Mobile number should contain only digits", {
        position: "top-right",
      });
    }

    if (!userData.age) {
      errors.age = "Age is required";
      toast.error("Age is required", { position: "top-right" });
    } else if (userData.age < 18) {
      errors.age = "Age must be greater than 18";
      toast.error("Age must be greater than 18", { position: "top-right" });
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const deleteUser = async (id) => {
    const popup = window.prompt(
      "Are you sure you want to delete this user? Enter 'yes' to confirm"
    );
    if (popup === "yes") {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:5000/delete_user/${id}`
        );
        console.log(response.data);
        setCheck((prevCheck) => !prevCheck);
        toast.success("User deleted successfully", { position: "top-right" });
      } catch (error) {
        console.log("Error occurred", error);
      }
    }
  };

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value.trim(),
    });
    console.log(userData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/register",
          userData
        );
        console.log(response.data);
        toast.success("User created successfully", { position: "top-right" });
        setUserData({
          firstName: "",
          lastName: "",
          gender: "",
          userName: "",
          email: "",
          mobile: "",
          age: "",
        });
        setCheck((prevCheck) => !prevCheck);
      } catch (error) {
        console.log("Error occurred", error);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect");
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_user_data");
        const filteredData = response.data.filter(
          (user) => user.role !== "admin"
        );
        setGetUserData(filteredData);
        console.log(filteredData);
      } catch (error) {
        console.log("Error occurred", error);
      }
    };
    fetchUserData();
  }, [check]);

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
          {Array.isArray(getUserData) &&
            getUserData.map((user, index) => (
              <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.age}</td>
                <td>{user.userName}</td>
                <td>{user.gender}</td>
                <td>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create User</h2>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleUpdate}
          />
          {/* {errors.firstName && <p className="error">{errors.firstName}</p>} */}
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleUpdate}
          />
          {/* {errors.lastName && <p className="error">{errors.lastName}</p>} */}
        </label>
        <label>
          Gender:
          <select name="gender" value={userData.gender} onChange={handleUpdate}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {/* {errors.gender && <p className="error">{errors.gender}</p>} */}
        </label>
        <label>
          Username:
          <input
            type="text"
            name="userName"
            value={userData.userName}
            onChange={handleUpdate}
          />
          {/* {errors.userName && <p className="error">{errors.userName}</p>} */}
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleUpdate}
          />
          {/* {errors.email && <p className="error">{errors.email}</p>} */}
        </label>
        <label>
          Mobile:
          <input
            type="tel"
            name="mobile"
            value={userData.mobile}
            onChange={handleUpdate}
          />
          {/* {errors.mobile && <p className="error">{errors.mobile}</p>} */}
        </label>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={userData.age}
            onChange={handleUpdate}
          />
          {/* {errors.age && <p className="error">{errors.age}</p>} */}
        </label>
        <button type="submit" onClick={() => setCheck((check) => !check)}>
          Create User
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
