import './App.css';
import SignUp from './components/SignUp'
import Login from './components/Login'
import EditProfile from './components/EditProfile';
import Feeds from './components/Feeds';
import Feeds1 from './components/Feeds1';

import Navbar from './components/Navbar'
import LoginProtectedRoutes from './components/ProtectedRoutes/LoginProtectedRoutes'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import React,{useState,useEffect} from "react";


function App() {
  const [token,setToken]=useState('')
  const [image,setImage]=useState('')
  const [userInfo,setUserInfo]=useState({})
useEffect(()=>{
setToken(localStorage.getItem('token')?true:false)
},[token])
console.log(userInfo)
  return (
    <div className="App">
    
     <Router>
{/*         
         <Route path='/' element={<Navigate to={'/login'}/>}/>

         <Routes> 
         <Route element={<ProtectedRoutes token={token}/>}>
        <>
        
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp/> } />
     
                </>
            
      </Route>
      </Routes> */}
    
      {/* <Navbar image={image} setImage={setImage}/>
      <Routes> 
      <Route element={<LoginProtectedRoutes token={token}/>}>
        <>
     
                 <Route path='/defaultroute' element={<Feeds image={image} setImage={setImage}/> } />
                 <Route path='/editprofile' element={<EditProfile image={image} setImage={setImage}/> } />
                
                </>
            
      </Route>
      </Routes> */}
      <Routes>
      <>
     
     <Route path='/login' element={<Login />} />
         <Route path='/signup' element={<SignUp/> } />
              <Route path='/defaultroute' element={<Feeds1/> } />
              <Route path='/editprofile/:id' element={<EditProfile/> } />
             <Route path='/' element={<Navigate to={'/login'}/>}/>
             </>
             </Routes>
        {
        //  token === null ?(
        //     <Routes>
        //        <Route path='/login' element={<Login />} />
        //         <Route path='/signup' element={<SignUp/> } />
        //         <Route path='/' element={<Navigate to={'/login'}/>}/>
        //     </Routes>
        //  ):(
        //    <>
        //       <Navbar/>
        //       <Routes> 
        //         <Route path='/defaultroute' element={<Feeds/> } />
        //         <Route path='/editprofile' element={<EditProfile/> } />
        //         <Route path='/' element={<Navigate to={'/defaultroute'}/>}/>

        //       </Routes>
        //    </>
        //  )
       }
         {/* <Navbar/>
         <Routes>
       
            <Route path='/defaultroute' element={<Feeds/> } />
            <Route path='/editprofile' element={<EditProfile/> } />
            <Route path='/' element={<Navigate to={'/defaultroute'}/>}/> 
            </Routes>     */}
      </Router> 
    </div>
  );
}

export default App;
