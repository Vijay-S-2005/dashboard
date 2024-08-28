import React from "react";
import { Outlet } from "react-router-dom";
import Login from './Login';
import Heading from './Heading';


export default function LoginRouter() {
    return (
        <div>
        <Heading heading={"Chennai Traffic Visualization"}/>

       <Outlet/> 
      {console.log(localStorage.getItem('user_data'))
      }
        {/* {localStorage.getItem('session_id') ? <Outlet/> : <Login/>} */}
        </div>
    );
    }