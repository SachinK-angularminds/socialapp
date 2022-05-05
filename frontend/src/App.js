import './App.css';
import SignUp from './components/SignUp'
import Login from './components/Login'
import EditProfile from './components/EditProfile';
import Feeds from './components/Feeds';
import Feeds1 from './components/Feeds1';

import Navbar from './components/Navbar'
import LoginProtectedRoutes from './components/ProtectedRoutes/LoginProtectedRoutes'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
function App() {

  return (
    <div className="App">
     <Router>
       <>
         <Routes>
   
        <Route exact path="/" element={<Navigate to="/login" />}></Route>
        <Route element={<LoginProtectedRoutes />}>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/signup" element={<SignUp />}></Route>

        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/feeds" element={<Feeds1 />}></Route>
          <Route exact path="/editprofile/:id" element={<EditProfile />}></Route>
        </Route>
      </Routes>
      </>
       
      </Router>
    </div>
  );
}
export default App;