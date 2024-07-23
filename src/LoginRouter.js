import React from "react";
import { Outlet } from "react-router-dom";
import Login from './Login';
import Heading from './Heading';


export default function LoginRouter() {
    return (
        <div>
        <Heading heading={"Chennai Traffic Visualization"}/>

      {localStorage.getItem('user_data') ? <Outlet/> : <Login/>}
        {/* {localStorage.getItem('session_id') ? <Outlet/> : <Login/>} */}
        </div>
    );
    }