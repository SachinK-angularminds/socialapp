import { Navigate, Outlet } from "react-router-dom";

const useAuth=(token)=>{
  console.log(token)
  const user={loggedIn:token}
  return user.loggedIn
}
const LoginProtectedRoutes = (token) => {
let auth=useAuth(token)
console.log(auth)
  return auth == 'false' ? (
    <>
    <Navigate to='/login'/>
  { console.log('hi')}
    </>

  ) : (
    <>
   
  <Outlet/>
      { console.log('hello')}
   </>
  );
};



export default LoginProtectedRoutes;