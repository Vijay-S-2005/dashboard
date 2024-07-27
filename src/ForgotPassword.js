import React,{useState} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ForgotPassword() {
    const [result,setResult]=useState('');
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');


    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:5000/forgot_password`,{username,email});
            console.log(response.data);
            toast.success(response.data.message, { position: "top-right" });
        }
        catch(error){
            console.log("Error occurred during login:", error);
            toast.error("username or email invalid", { position: "top-right" });
        }
    }
    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <label>username</label>
                <input type="text" placeholder="user id" value={username} onChange={(e) => {setUsername(e.target.value.trim());}} />

                <label>Email</label>
                <input type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value.trim());}} />
                <button type="submit" >Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
    }
