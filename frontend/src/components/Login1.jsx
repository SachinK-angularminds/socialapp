import React, { useState } from "react";
import {
  Card,
  CardActions,
  Grid,
  Typography,
  Box,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import apiUrl from "../api";
import { GoogleLogin } from "react-google-login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const theme = createTheme();
theme.typography.div = {
  fontFamily: '"Segoe UI Symbol"',
  // fontSize: "1rem",
  // color: "#999999"
};
theme.typography.h4 = {
  fontFamily: '"Segoe UI Symbol"',
  fontSize: "2rem",
  color: "#4d79ff",
};
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Login(props) {
  let navigate=useNavigate()
  const initialState = {
 
    email: "",
    password: "",
  };
  const [userceredantialobj, setUserCrediantialObj] = useState(initialState);
  const [errors, seterrors] = useState({ email: "", password: "" });
  const [errorServer,setErrorServer]=useState('')

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };
  
  const handleEmail = (event) => {
    setUserCrediantialObj({ ...userceredantialobj, email: event });
    if (event === "") {
      seterrors({ ...errors, email: "Email cannot be empty" });
    } else if (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(event) === false
    ) {
      seterrors({ ...errors, email: "Invalid Email" });
    } else {
      seterrors({ ...errors, email: "" });
    }
  };
  const handlePassword = (event) => {
    setUserCrediantialObj({ ...userceredantialobj, password: event });
    if (event === "") {
      seterrors({ ...errors, password: "Password cannot be empty" });
    } else if (/^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(event) === false) {
      seterrors({ ...errors, password: "Invalid Password" });
      console.log("pass");
    } else {
      seterrors({ ...errors, password: "" });
    }
  };
  

  const responseGoogle = async (response) => {
    console.log(response.profileObj);
    let idtokenval = response.tokenObj.id_token
    console.log(idtokenval)
    // let data = { idToken: idtokenval };
     try{
       const result = await apiUrl.post("/api/auth/google", {
         idToken: idtokenval,
       });
       console.log(result);
        localStorage.setItem('token1',JSON.stringify(result.data.token))
       localStorage.setItem("userInfo", JSON.stringify(result.data.user));
       navigate("/feeds");
     }catch(e){
       console.log(e.message)
     }
  };
  const validate = () => {
    console.log(userceredantialobj.email);
    let flag = false;
    if (userceredantialobj.password === "") {
      // seterrors({...errors,password:'Password cannot be empty'})
      seterrors((prevState) => ({
        errors: { ...prevState.errors, password: "Password cannot be empty" },
      }));
      flag = true;
    } else if (
      /^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(userceredantialobj.password) === false
    ) {
      // seterrors({...errors,password:'Invalid Password'})
      seterrors((prevState) => ({
        errors: { ...prevState.errors, password: "Invalid Password" },
      }));
      flag = true;
    } else {
      seterrors((prevState) => ({
        errors: { ...prevState.errors, password: "" },
      }));
    }
    if (userceredantialobj.email === "") {
      // seterrors({...errors,email:'Email cannot be empty'})
      seterrors((prevState) => ({
        ...prevState.errors,
        email: "Email cannot be empty",
      }));
      flag = true;
    } else if (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        userceredantialobj.email
      ) === false
    ) {
      // seterrors({...errors,email:'Invalid Email'})
      seterrors((prevState) => ({
        ...prevState.errors,
        email: "Invalid Email",
      }));
      flag = true;
    } else {
      seterrors((prevState) => ({ ...prevState.errors, email: "" }));
    }
    if (flag) {
      return false;
    } else {
      return true;
    }
  };
  const handleSubmit=async()=>{
    if(validate()){
      const result=await apiUrl
      .post("login", {
        
        email: userceredantialobj.email,
        password: userceredantialobj.password,
      })
      .then(function (response) {
        console.log(response)
        localStorage.setItem('token',JSON.stringify(response.data.token))
        localStorage.setItem('userInfo',JSON.stringify(response.data.user))
        props.setOpenLogin(true)
        navigate('/feed')
  
      },(error)=>{
        setErrorServer(error.response.data.error.message)
       });
    }
  }
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh", marginTop: "0.5rem" }}
    >
      <Card sx={{ width: 420, marginTop: "100px", spacing: "10px" ,boxShadow: 6 }}>
        <CardContent>
          <Box>
            <ThemeProvider theme={theme}>
              <Typography variant="h4">Login</Typography>
            </ThemeProvider>
          </Box>
          <Box sx={{ m: 2 }}>
            <TextField
              required
              type="email"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              error={errors.email ? true : false}
              helperText={errors.email}
              onChange={(e) => handleEmail(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ m: 2 }}>
            <TextField
              required
              type="password"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              error={errors.password ? true : false}
              helperText={errors.password}
              onChange={(e) => handlePassword(e.target.value)}
              fullWidth
            />
          </Box>
        </CardContent>
        <Grid container>
          <Grid item xs={12}>
            {/* <CardActions sx={{marginLeft:'30px'}}> */}
            <Button
              variant="contained"
              size="large"
              sx={{ width: "11rem", backgroundColor: "#4d79ff" }}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Snackbar open={props.open} autoHideDuration={3000} onClose={handleClose}  anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          SignUp successful!
        </Alert>
      </Snackbar>
            {/* <Button variant="contained" onClick={handleSignup}>Signout</Button> */}
            {/* </CardActions> */}
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography> OR </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <GoogleLogin
                clientId="72753215683-bnrorqcik8r5n6caofm1p3e7mlk0lf5l.apps.googleusercontent.com"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 3, mb: 3 }}>
              <ThemeProvider theme={theme}>
                <Typography variant="div">
                  Don't have an account?{" "}
                  <NavLink
                    to="/signup"
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    SignUp
                  </NavLink>
                </Typography>
              </ThemeProvider>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
export default Login