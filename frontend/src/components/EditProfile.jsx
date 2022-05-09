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
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MuiPhoneNumber from "material-ui-phone-number";
import { makeStyles } from "@mui/styles";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import apiUrl from "../api";

const Input = styled("input")({
  display: "none",
});
const useStyles = makeStyles({
  root: {
    color: "red",
  },
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EditProfile(props) {
  const classes = useStyles();
  const { id } = useParams();
  let navigate = useNavigate();
  const formdata = new FormData();
 
  const initialState = {
    name: "",
    bio: "",
    gender: "",
    dob: null,
    email: "",
    mobile: "",
    photo: "",
  };
  const [updateUserObj, setUpdateUserObj] = useState(initialState);
  const [image, setImage] = useState("");
  const [open,setOpen] = useState(false)
  const [fullName, setFullName] = React.useState("");
  const [updateProfileSnackbar,setUpdateProfileSnackbar]=useState(false)

  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [slashOn, setslashOn] = useState(false);
  const [errors, seterrors] = useState({
    email: "",
    name: "",
    gender: "",
    mobile: "",
  });

  useEffect(() => {
    getUserProfile();
  }, []);


  useEffect(() => {
    let name = userInfo.firstName + " " + userInfo.lastName;
    setFullName(name);
  }, [fullName]);
  const getUserProfile = async () => {
    await apiUrl.get(`user-profile`).then(function (response) {
      console.log(response.data.user);
      if(!response.data){
        setUpdateUserObj({})
        setImage({})
      }else{
        console.log(response.data)
        setUpdateUserObj(response.data.user);
        setImage(response.data.user.photo);
       
        // if(response.data.user.photo === '' || response.data.user.photo === undefined ){
        //   setImage('')
        // }else{
        //   setImage(response.data.user.photo);

        // }
      }
     
    });
  };
  console.log(image);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setUpdateProfileSnackbar(false);
  };
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
    setUpdateUserObj({ ...updateUserObj, mobile: value });
    console.log(value.length)
   
  };
  const handleGender = (event) => {
    setUpdateUserObj({ ...updateUserObj, gender: event.target.value });
    if (event === "") {
      seterrors({ ...errors, gender: "Enter value" });
    } else {
      seterrors({ ...errors, gender: "" });
    }
  };
  const onDateHandler = (value) => {
    // date = date.slice(1,11)
    setUpdateUserObj({
      ...updateUserObj,
      dob: value,
    });
  };
  const handleChange = (e) => {
    setUpdateUserObj({ ...updateUserObj, photo: e.target.files[0] });
    setslashOn(true);
    const url = URL.createObjectURL(e.target.files[0]);
    console.log(url);
    setImage(url);
  };
  console.log(updateUserObj);
  const handleRemove = () => {
    setImage("");
  };

  const handleOpen = () => {
    setOpen(true);
  }
  const validate = () => {
    let flag = false;
    if (updateUserObj.gender === "") {
      seterrors((prevState) => ({
        errors: { ...prevState.errors, gender: "Enter Values" },
      }));
    }
    if (updateUserObj.mobile === undefined) {
      seterrors((prevState) => ({
        errors: { ...prevState.errors, mobile: "Enter MobileNumber" },
      }));
      flag = true;
    }else if(updateUserObj.mobile.length !==15){
      seterrors((prevState) => ({
        errors: { ...prevState.errors, mobile: "Mobile number must be 10 digits" },
      }));
      flag = true;
    }

    if (updateUserObj.name === "") {
      seterrors((prevState) => ({
        errors: { ...prevState.errors, name: "FirstName cannot be empty" },
      }));
      flag = true;
    } else {
      seterrors((prevState) => ({
        errors: { ...prevState.errors, name: "" },
      }));
    }

    if (updateUserObj.email === "") {
      // seterrors({...errors,email:'Email cannot be empty'})
      seterrors((prevState) => ({
        ...prevState.errors,
        email: "Email cannot be empty",
      }));

      flag = true;
    } else if (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        updateUserObj.email
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

    if (updateUserObj.email === "") {
      seterrors((prevState) => ({
        ...prevState.errors,
        email: "Email cannot be empty",
      }));

      flag = true;
    }

    if (flag) {
      return false;
    } else {
      return true;
    }
  };
  console.log(errors);
  const handleSubmit = async () => {
    formdata.append("photo", updateUserObj.photo);
    formdata.append("name", updateUserObj.name);
    formdata.append("bio", updateUserObj.bio);
    formdata.append("gender", updateUserObj.gender);
    formdata.append("dob", updateUserObj.dob);
    formdata.append("mobile", updateUserObj.mobile);
    formdata.append("email", updateUserObj.email);
    console.log(formdata.get("photo"));
    if (validate()) {
      const result = await apiUrl
        .post(`edit/${id}`, formdata)
        .then((response) => console.log(response));
        setUpdateProfileSnackbar(true)
     // setslashOn(false);
      setTimeout(() => {
        navigate("/feed");
      },1000)
     
    }
  };
  const getInitials = (fullName) => {
    const allNames = fullName.trim().split(" ");
    const initials = allNames.reduce((acc, curr, index) => {
      if (index === 0 || index === allNames.length - 1) {
        acc = `${acc}${curr.charAt(0).toUpperCase()}`;
      }
      return acc;
    }, "");
    return initials;
  };
  return (
    <>
      <Navbar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: "100vh", marginTop: "", backgroundColor: "#e6f2ff"  }}
      >
        <Paper elevation={6} sx={{ margin: 5 }}>
          <Card sx={{ minWidth: 600, marginTop: "50px", spacing: "10px" }}>
            <form>
              <CardContent>
                <Box>
                  <Typography gutterBottom variant="h4" component="div">
                    EditProfile
                  </Typography>
                </Box>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12}>
                    <Box>
                      {image === "" ? (
                        <Avatar alt="Sachin" sx={{ width: 120, height: 120 }}>
                          {getInitials(fullName)}
                        </Avatar>
                      ) : slashOn === false ? (
                        <Avatar
                          alt="Remy Sharp"
                          src={`/${image}`}
                          sx={{ width: 120, height: 120 }}
                        ></Avatar>
                      ) : (
                        <Avatar
                          alt="Remy Sharp"
                          src={`${image}`}
                          sx={{ width: 120, height: 120 }}
                        ></Avatar>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <label htmlFor="contained-button-file">
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={handleChange}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      name="addphoto"
                      component="span"
                      sx={{ margin: 2 }}
                    >
                      Add
                    </Button>
                  </label>
                  <Button
                    variant="contained"
                    size="small"
                    name="remove"
                    component="span"
                    onClick={handleRemove}
                  >
                    Remove
                  </Button>
                </Grid>
                {/* </Box> */}
                <Box sx={{ m: 2 }}>
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    value={updateUserObj?updateUserObj.name:''}
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
                    value={updateUserObj?updateUserObj.bio:''}
                    placeholder="Bio"
                    style={{ width: 520 }}
                    onChange={(e) =>
                      setUpdateUserObj({
                        ...updateUserObj,
                        bio: e.target.value,
                      })
                    }
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
                        value={updateUserObj?updateUserObj.gender:''}
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
                        value={updateUserObj?(updateUserObj.dob):null}
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
                    value={updateUserObj?updateUserObj.email:''}
                    onChange={(e) => handleEmail(e.target.value)}
                    error={errors.email ? true : false}
                    helperText={errors.email}
                    fullWidth
                  />
                </Box>
                <Box sx={{ m: 2 }}>
                  <MuiPhoneNumber
                    defaultCountry={"in"}
                    value={updateUserObj?updateUserObj.mobile:''}
                    onChange={handleMobileNumber}
                    fullWidth
                  />
                  <Typography
                    align="left"
                    sx={{ color: "red", fontSize: "0.8rem" }}
                    onChange={handleOpen}
                  >
                    {errors.mobile}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ marginLeft: "30px" }}>
                <Button variant="contained" onClick={handleSubmit}>
                  Edit Profile
                </Button>
                <Snackbar open={updateProfileSnackbar} autoHideDuration={1000} onClose={handleClose}     anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Update successful!
        </Alert>
      </Snackbar> 
              </CardActions>
            </form>
          </Card>
        </Paper>
       
      </Grid>
    </>
  );
}

export default EditProfile;
