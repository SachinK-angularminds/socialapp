import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Modal,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import apiUrl from '../api'
const style = {
  position: "absolute",
  top: "33%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 580,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};
const theme = createTheme();
theme.typography.h6 = {
    fontFamily: '"Segoe UI Symbol"',
    fontSize: "1rem",
    color: "#999999"
  }
  theme.typography.h5 = {
    fontSize: "1.5rem",
    color: "#333333",
  }

function ChangePassword() {
  const initialState={
    oldPassword:'',
    newPassword:'',
    confirmPassword:'',
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    seterrors({newPassword:'',confirmPassword:''})
  }
  const [passwordObj,setPasswordObj]=useState(initialState)
  const [errors,seterrors]=useState({newPassword:'',confirmPassword:''})

  const handleCurrentPassword=(event)=>{
    setPasswordObj({...passwordObj,oldPassword:event})
  }
  const handleNewPassword=(event)=>{
    setPasswordObj({...passwordObj,newPassword:event})
    if (event === "") {
      seterrors({ ...errors, newPassword: "New Password cannot be empty" });
    } else if (/^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(event) === false) {
      seterrors({ ...errors, newPassword: "Invalid Password" });
      console.log("pass");
    } else {
      seterrors({ ...errors, newPassword: "" });
    }

  }
  const handleConfirmPassword=(event)=>{
    setPasswordObj({...passwordObj,confirmPassword:event})
    if(event!==''){
      seterrors({ ...errors, confirmPassword: "" });

    }
  }
  const validate = () => {
    console.log(passwordObj.confirmPassword);
    let flag = false;

    if (passwordObj.confirmPassword === "") {
      // seterrors({...errors,password:'Password cannot be empty'})
      seterrors((prevState) => ({
       errors:  { ...prevState.errors, confirmPassword: "Password cannot be empty" }
      }));
      flag = true;
    }
    else if(passwordObj.newPassword !== passwordObj.confirmPassword){
      console.log('error success')
      seterrors((prevState)=>({
       errors: {...prevState.errors,confirmPassword:"Password should match with new password"}
      }))
      flag = true;
    }
   
    if (passwordObj.newPassword === "") {
      // seterrors({...errors,password:'Password cannot be empty'})
      seterrors((prevState) => (
         { ...prevState.errors, newPassword: "Password cannot be empty" }
      ));
      flag = true;
    } else if (
      /^(?=.*\d)(?=.*[a-z]).{6,20}$/.test(passwordObj.newPassword) === false
    ) {
      // seterrors({...errors,password:'Invalid Password'})
      seterrors((prevState) => ({
        ...prevState.errors, newPassword: "Invalid Password" }
      ));

      flag = true;
    } else {
      seterrors((prevState) => (
         { ...prevState.errors, newPassword: "" }
      ));
    }
    if (flag) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit=async()=>{
    if(validate()){
      const result=await apiUrl.post('change-password',{
      oldPassword:passwordObj.oldPassword,
      newPassword:passwordObj.newPassword,
      confirmPassword:passwordObj.confirmPassword
    })
    .then(function (response) {
console.log(response)      
  })
  handleClose()
    }
    
}
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "start", color: "black" }}>
        <p onClick={handleOpen} >Change Password</p>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container>
            <Grid item xs={6}>
            <ThemeProvider theme={theme}>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  textAlign="left"
                  sx={{ ml: 3,mt:3,mb:3 }}
                >
                  Change Password
                </Typography>
              </Box>
              <Typography
                variant="h6"
                component="h6"
                textAlign="left"
                sx={{ ml: 4,mb:1 }}
              >
                Password must contain:
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                textAlign="left"
                sx={{ ml: 4,mb:1 }}
              >
                Atleast six character
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                textAlign="left"
                sx={{ ml: 4 ,mb:1}}
              >
                Atleast 1 symbol
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                textAlign="left"
                sx={{ ml: 4,mb:1 }}
              >
                Atleast 1 number
              </Typography>
              </ThemeProvider>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item>
                  <TextField
                  type="password"
                    id="outlined-basic"
                    label="Current Password"
                    variant="outlined"
                    onChange={(e)=>handleCurrentPassword(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item>
                  <TextField
                    type="password"
                    id="outlined-basic"
                    label="New Password"
                    variant="outlined"
                    error={errors.newPassword  ? true : false}
                    helperText={errors.newPassword}
                    onChange={(e)=>handleNewPassword(e.target.value)}

                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item>
                  <TextField
                   type="password"
                    id="outlined-basic"
                    label="Confirm Password"
                    variant="outlined"
                    error={errors.confirmPassword  ? true : false}
                    helperText={errors.confirmPassword}
                    onChange={(e)=>handleConfirmPassword(e.target.value)}

                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: "2rem"}}>
                <Button variant="contained" sx={{width:'14rem'}} onClick={handleSubmit}>Submit</Button>
              </Box>
              <Box sx={{ mt: "2rem" }}>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default ChangePassword;
