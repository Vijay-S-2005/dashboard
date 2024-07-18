// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import About from './About';
import Help from './Help';
import Dashboard from './Dashboard'
import Login from './Login';
import register from './Register';
import './App.css';
import PrivateRoute from './PrivateRoute';
import { Navigate } from 'react-router-dom';

// import Heading from './Heading';
// import Contact from './Contact';

const App = () => {

  return (
    <Router>
    <div>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route element={<PrivateRoute />}>
          <Route path='home' element={<Home/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          </Route>
          
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </Router>
  );
};


export default App;