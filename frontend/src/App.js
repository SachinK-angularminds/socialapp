import './App.css';
import SignUp from './components/SignUp'
import Login from './components/Login'
import Login1 from './components/Login1'
import React, { useState } from "react";
import EditProfile from './components/EditProfile';
import Feeds from './components/Feeds';
import Feeds1 from './components/Feeds1';

import Navbar from './components/Navbar'
import LoginProtectedRoutes from './components/ProtectedRoutes/LoginProtectedRoutes'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
function App() {
  const [openSignUp,setOpenSignUp]=useState(false)
  const [openLogin,setOpenLogin]=useState(false)

  return (
    <div className="App">
     <Router>
       <>
         <Routes>
   
        <Route exact path="/" element={<Navigate to="/login" />}></Route>
        <Route element={<LoginProtectedRoutes />}>
          <Route exact path="/login" element={<Login1 open={openSignUp} setOpen={setOpenSignUp} setOpenLogin={setOpenLogin}/>}></Route>
          <Route exact path="/signup" element={<SignUp open={openSignUp} setOpen={setOpenSignUp}/>}></Route>

        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/feed" element={<Feeds1 openLogin={openLogin} setOpenLogin={setOpenLogin}/>}></Route>
          <Route exact path="/editprofile/:id" element={<EditProfile />}></Route>
        </Route>
      </Routes>
      </>
       
      </Router>
    </div>
  );
}
export default App;