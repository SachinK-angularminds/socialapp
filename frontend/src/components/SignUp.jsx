import React, { useState } from "react";
import {
  Card,
  Grid,
  Typography,
  Box,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate,NavLink } from "react-router-dom";
import apiUrl from '../api';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme();
theme.typography.div = {
  fontFamily: '"Segoe UI Symbol"',
  // fontSize: "1rem",
  // color: "#999999"
}
theme.typography.h4 = {
  fontFamily: '"Segoe UI Symbol"',
  fontSize: "2rem",
   color: "#4d79ff"
}

function SignUp(props) {
  let navigate = useNavigate();
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  const [userobj, setUserObj] = useState(initialState);
  const [errors, seterrors] = useState({ email: "", password: "",firstName:'',lastName:'' });
  const [errorServer,setErrorServer]=useState('')
  const handleEmail = (event) => {
    setUserObj({ ...userobj, email: event });
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
  const handleFirstName=(event)=>{
    setUserObj({ ...userobj, firstName: event })
  
    if(event===''){
      seterrors({...errors,firstName:'FirstName is required'})
    }else{
      seterrors({ ...errors, firstName: "" });
}
  }

  const handleLastName=(event)=>{
    setUserObj({ ...userobj, lastName: event })
  
    if(event===''){
      seterrors({...errors,lastName:'LastName is required'})
    }else{
      seterrors({ ...errors, lastName: "" });
}
  }
  const handlePassword = (event) => {
    setUserObj({ ...userobj, password: event });
    if (event === "") {
      seterrors({ ...errors, password: "Password cannot be empty" });
    } else if (/^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(event) === false) {
      seterrors({ ...errors, password: "Invalid Password" });
      console.log("pass");
    } else {
      seterrors({ ...errors, password: "" });
    }
  };

  const validate = () => {
    console.log(userobj.email);
    let flag = false;

    if(userobj.firstName===''){
      seterrors((prevState) => ({
        errors: { ...prevState.errors, firstName: "FirstName cannot be empty" },
      })); 
      flag = true;
    }else{
        seterrors((prevState) => ({
          errors: { ...prevState.errors, firstName: "" },
        }));}

if(userobj.lastName===''){
  seterrors((prevState) => ({
    errors: { ...prevState.errors, lastName: "LastName cannot be empty" },
    
  }));
  flag = true;
}else{
    seterrors((prevState) => ({
      errors: { ...prevState.errors, lastName: "" },
    }));}
    if (userobj.password === "") {
      // seterrors({...errors,password:'Password cannot be empty'})
      seterrors((prevState) => ({
        errors: { ...prevState.errors, password: "Password cannot be empty" },
      }));
      flag = true;
    } else if (
      /^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(userobj.password) === false
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

    if (userobj.email === "") {
      // seterrors({...errors,email:'Email cannot be empty'})
      seterrors((prevState) => ({
        ...prevState.errors,
        email: "Email cannot be empty",
      }));

      flag = true;
    } else if (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userobj.email) ===
      false
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

  const handleSubmit = async () => {
    if (validate()) {
      await apiUrl
        .post("register", {
          firstName: userobj.firstName,
          lastName: userobj.lastName,
          email: userobj.email,
          password: userobj.password,
        })
        .then(function (response) {
          console.log(response);
          props.setOpen(true);
          navigate("/login");
        },(error)=>{
         setErrorServer(error.response.data.error.message)
        });
      
    }
  };
  console.log(errorServer)
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh", marginTop: "" }}
    >
      <Card sx={{ minWidth: 420, marginTop: "100px", spacing: "10px" ,boxShadow: 6 }}>
        <form>
          <CardContent>
            <Box>
            <Box>
        
        <ThemeProvider theme={theme}>
       <Typography variant='h4'>SignUp</Typography>
       </ThemeProvider>
        </Box>
            </Box>
            <Box sx={{ m: 2 }}>
              <TextField
                id="outlined-basic"
                label="FirstName"
                variant="outlined"
                error={errors.firstName ? true : false}
                helperText={errors.firstName}
                onChange={(e) =>
                  handleFirstName(e.target.value)
                }
                fullWidth
                required
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <TextField
                id="outlined-basic"
                label="LastName"
                variant="outlined"
                onChange={(e) =>
                   handleLastName(e.target.value)}
                   error={errors.lastName ? true : false}
                   helperText={errors.lastName}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <TextField
                type="email"
                id="outlined-basic"
                label="Email"
                variant="outlined"
                onChange={(e) => handleEmail(e.target.value)}
                error={errors.email ? true : false}
                helperText={errors.email}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <TextField
                type="password"
                id="outlined-basic"
                label="Password"
                variant="outlined"
                onChange={(e) => handlePassword(e.target.value)}
                error={errors.password !== "" ? true : false}
                helperText={errors.password}
                fullWidth
                required
              />
            </Box>
          </CardContent>
          <Grid container>
      <Grid item xs={12} sx={{mb:3}}>
    {/* <CardActions sx={{marginLeft:'30px'}}> */}

    <Button variant="contained" size='large' sx={{width:'11rem',backgroundColor: "#4d79ff"}} onClick={handleSubmit}>SignUp</Button>
    {/* <Button variant="contained" onClick={handleSignup}>Signout</Button> */}
    {/* </CardActions> */}
    </Grid>
    <Grid container>
    <Grid item xs={12} sx={{mt:1,color:'red'}}>
    <Typography>{errorServer}</Typography>
</Grid>
    </Grid>
    <Grid container>
      <Grid item xs={12} sx={{mt:3,mb:3}}>
      <ThemeProvider theme={theme}>
     <Typography variant='div'>Already have an account? <NavLink to="/login" style={{textDecoration:'none' ,color:'blue'}}>SignIn</NavLink></Typography>
     </ThemeProvider>
        </Grid>
     </Grid>
   
    </Grid>

        </form>
      </Card>
    </Grid>
  );
}

export default SignUp;
