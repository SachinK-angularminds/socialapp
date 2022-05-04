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
  Avatar,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  TextareaAutosize,
  Paper
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MuiPhoneNumber from "material-ui-phone-number";
import { makeStyles } from "@mui/styles";
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {useNavigate, useLocation,useParams} from 'react-router-dom'
import Navbar from './Navbar'
import { useEffect } from "react";
import apiUrl from "../api"


const Input = styled('input')({
  display: 'none',
});
const useStyles = makeStyles({
  root: {
    color: "red",
  },
});
function EditProfile(props) {
  const classes = useStyles();
  const {id}=useParams()
  let navigate=useNavigate()
  const formdata = new FormData(); 

  const initialState = {
    name: "",
    bio: "",
    gender: "",
    birthdate: null,
    email: "",
    mobilenumber: "",
    photo:""
  };
  const [updateUserObj, setUpdateUserObj] = useState(initialState);
  const [image,setImage]=useState("")
  const [initials,setInitials]=useState('')
  const [slashOn,setslashOn]=useState(false)
  const [errors, seterrors] = useState({
    email: "",
    name: "",
    gender: "",
  });


  useEffect(()=>{
    getUserProfile()
  },[])

  const getUserProfile = async() => {
    const result=await apiUrl.get(`user-profile`).then((function(response) {
     setUpdateUserObj(response.data.user)
     setImage(response.data.user.photo)
 }))
  }
 console.log(image)
  const handleName = (event) => {
    setUpdateUserObj({ ...updateUserObj, name: event });
    if (event === "") {
      seterrors({ ...errors, name: "FirstName is required" });
    } else {
      seterrors({ ...errors, name: "" });
    }
  };

  const handleEmail = (event) => {
    setUpdateUserObj({ ...updateUserObj, email: event });

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
  const handleMobileNumber = (value) => {
    setUpdateUserObj({ ...updateUserObj, mobilenumber: value });
  };
  const handleGender = (event) => {
    setUpdateUserObj({ ...updateUserObj, gender: event.target.value });
    if (event === "") {
      seterrors({ ...errors, gender: "Enter value" });
    } else {
      seterrors({ ...errors, gender: "" });
    }
  };
  const onDateHandler=(value)=>{
    
    // date = date.slice(1,11)
    setUpdateUserObj({
        ...updateUserObj,
        birthdate:value
    })
}
const handleChange=(e)=>{
  setUpdateUserObj({...updateUserObj,photo:e.target.files[0]})
  setslashOn(true)
  const url=URL.createObjectURL(e.target.files[0])
 setImage(url)
}
console.log(updateUserObj)
const handleRemove=()=>{
  setImage('')
}
  const validate = () => {
    let flag=false
    if (updateUserObj.gender === "") {
      seterrors((prevState) => ({
        errors: { ...prevState.errors, gender: "Enter Values" },
      }));     }


    if(updateUserObj.name===''){
      seterrors((prevState) => ({
        errors: { ...prevState.errors, name: "FirstName cannot be empty" },
      })); 
      flag = true;
    }else{
        seterrors((prevState) => ({
          errors: { ...prevState.errors, name: "" },
        }));}


        if (updateUserObj.email === "") {
          // seterrors({...errors,email:'Email cannot be empty'})
          seterrors((prevState) => ({
            ...prevState.errors,
            email: "Email cannot be empty",
          }));
    
          flag = true;
        } else if (
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(updateUserObj.email) ===
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
  const handleSubmit = async() => {
    formdata.append('photo',updateUserObj.photo)
    formdata.append('name',updateUserObj.name)
    formdata.append('bio',updateUserObj.bio)
    formdata.append('gender',updateUserObj.gender)
    formdata.append('dob',updateUserObj.birthdate)
    formdata.append('mobile',updateUserObj.mobilenumber)
    formdata.append('email',updateUserObj.email)
    console.log(formdata.get('photo'))
    console.log(formdata.get('mobilenumber'))
    if (validate()) {
       const result=await apiUrl.post(`edit/${id}`,formdata).then((response)=>console.log(response))
       setslashOn(false)
       navigate('/defaultroute')
       
    }
  };
  const getInitials = (fullName) => {
    const allNames = fullName.trim().split(' ');
    const initials = allNames.reduce((acc, curr, index) => {
      if(index === 0 || index === allNames.length - 1){
        acc = `${acc}${curr.charAt(0).toUpperCase()}`;
      }
      return acc;
    }, '');
    return initials;
  }
  return (
    <>
     <Navbar/>
   
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh", marginTop: ""}}
    >
        <Paper elevation={6} sx={{margin:5}} >
      <Card sx={{ minWidth: 600, marginTop: "50px", spacing: "10px" }}>
    
        <form>
          <CardContent>
            <Box>
              <Typography gutterBottom variant="h4" component="div">
                EditProfile
              </Typography>
            </Box>
            {/* <Box sx={{ margin:'auto'
        // alignItems:"center",
        // justifyContent:"center"
        }}> */}
        <Grid container spacing={0} direction='column' alignItems='center' justify='center'>
          <Grid item xs={12}>
            <Box >
              {image === ''?
             <Avatar
             alt="Sachin"
            
             sx={{ width: 120, height: 120 }}
           >
             { getInitials('Sachin Kotian')}
           </Avatar>
            :  
            slashOn === false ?
              <Avatar
              alt="Remy Sharp"
              src={`/${image}`}
              sx={{ width: 120, height: 120 }}
            >
            </Avatar>
            :
            <Avatar
            alt="Remy Sharp"
            src={`${image}`}
            sx={{ width: 120, height: 120 }}
          >
          </Avatar>
            
            }
           
            </Box>
            </Grid>
            </Grid>
            <Grid item xs={12}>

            
      <label htmlFor="contained-button-file">
        <Input accept="image/*" id="contained-button-file"  type="file" onChange={handleChange}/>
        <Button variant="contained" size="small" name='addphoto' component="span" sx={{margin:2}} >
          Add
        </Button>
      </label>
      <Button variant="contained" size="small" name='remove' component="span" onClick={handleRemove}>
          Remove
        </Button>
      
   
    </Grid>
    {/* </Box> */}
            <Box sx={{ m: 2 }}>
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                value={updateUserObj.name}
                onChange={(e) => handleName(e.target.value)}
                error={errors.name ? true : false}
                helperText={errors.name}
                fullWidth
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                value={updateUserObj.bio}
                placeholder="Bio"
                style={{ width: 520 }}
                onChange={(e)=>setUpdateUserObj({...updateUserObj,bio:e.target.value})}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "start" }}>
              <FormControl>
                <FormLabel sx={{ marginRight: "100px" }}> Gender</FormLabel>
                <Box sx={{ marginLeft: "20px" }}>
                  <RadioGroup
                    name="gender"
                    aria-labelledby="genderlabel"
                    onChange={handleGender}
                    value={updateUserObj.gender}
                    row
                  >
                    <FormControlLabel
                      control={<Radio size="small" />}
                      label="Male"
                      value="male"
                    />
                    <FormControlLabel
                      control={<Radio size="small" />}
                      label="Female"
                      value="female"
                    />
                  </RadioGroup>
                </Box>
              </FormControl>
            </Box>
            <Box sx={{ marginLeft: "1.2rem" }}>
              <Typography className={classes.root} align="left">
                {errors.gender}
              </Typography>
            </Box>
            <Box sx={{ m: 2 }}>
              <Grid container>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={new Date(updateUserObj.birthdate)}
                    onChange={(newValue) => {
                      onDateHandler(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Box>
            <Box sx={{ m: 2 }}>
              <TextField
                type="email"
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={updateUserObj.email}
                onChange={(e) => handleEmail(e.target.value)}
                error={errors.email ? true : false}
                helperText={errors.email}
                fullWidth
              />
            </Box>
            <Box sx={{ m: 2 }}>
              <MuiPhoneNumber
                defaultCountry={"in"}
                value={updateUserObj.mobile}
                onChange={handleMobileNumber}
                fullWidth
              />
              
            </Box>
          </CardContent>
          <CardActions sx={{ marginLeft: "30px" }}>
            <Button variant="contained" onClick={handleSubmit}>
              Edit Profile
            </Button>
          </CardActions>
        </form>
      
      </Card>
      </Paper>
    </Grid>
    </>
  );
}

export default EditProfile;
