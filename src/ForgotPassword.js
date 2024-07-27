import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://127.0.0.1:5000/forgot_password', { username, email });
            console.log(response.data);
            toast.success(response.data.message, { position: "top-right" });
        } catch (error) {
            console.log("Error occurred during login:", error);
            toast.error("username or email invalid", { position: "top-right" });
        }
    }

    return (
        <div className='container'>
            <div className='formContainer'>
                <div className='headingBox'>
                    <h1>Forgot Password</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="User ID" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value.trim())} 
                    />
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value.trim())} 
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
