import { Navigate, Outlet } from "react-router-dom";

const useAuth=(token)=>{
  console.log(token)
  
  return token
}
const ProtectedRoutes = (token) => {
let auth=token
console.log(auth)
  return auth  ? (
      <>
    <Navigate to='/defaultroute'/>
    {console.log('faile')}
    </>
  ) : (
      <>   
         <Outlet/>

       {console.log('success')}
      </>

  );
};



export default ProtectedRoutes;