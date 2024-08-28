// Home.js
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [id, setId] = useState('');
  const user_data = JSON.parse(localStorage.getItem('user_data'));



  const changePassword =async()=>{
    try{
      const response=await axios.post(`http://127.0.0.1:5000/change_password`,{id,oldPassword,newPassword,confirmPassword});
      console.log(response.data);
      // alert("Password Changed Successfully");
      toast.success("Password Changed Successfully", { position: "top-right" });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }catch(error){
      console.log("Error occurred during login:", error);
      // alert("error occured");
      toast.error(error, { position: "top-right" });

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
  
    }
  }



  const validate = () => {
    let errors = {};
    if (!oldPassword) {
      errors.oldPassword = "Old Password is required";
      toast.error("Old Password is required", { position: "top-right" });
    }
    if (!newPassword) {
      errors.newPassword = "New Password is required";
      toast.error("New Password is required", { position: "top-right" });
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
      toast.error("Confirm Password is required", { position: "top-right" });
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "New Password and Confirm Password do not match";
      toast.error("New Password and Confirm Password do not match", { position: "top-right" });
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    setId(user_data._id);
    
    if (validate()) {
      changePassword();
      // toast.success("Password Changed Successfully", { position: "top-right" });
    } else {
      console.log("Form has errors, do not submit.");
      toast.error("Form has errors, do not submit.", { position: "top-right" });
    }
  };

  return (
    <div className="ChangePasswordContainer">
      <div className="changePassword">
        <h1>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="oldPassword">Old Password</label>
          <input 
            type="password" 
            id="oldPassword" 
            name="oldPassword" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value.trim())} 
          />
          {/* <p>{errors.oldPassword}</p> */}

          <label htmlFor="newPassword">New Password</label>
          <input 
            type="password" 
            id="newPassword" 
            name="newPassword" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value.trim())} 
          />
          {/* <p>{errors.newPassword}</p> */}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value.trim())} 
          />
          {/* <p>{errors.confirmPassword}</p> */}
          {/* {toast.error(errors.confirmPassword, { position: "top-right" })} */}

          <button type="submit">Change Password</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ChangePassword;
