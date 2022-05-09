import React,{useState,useEffect,useCallback} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Key from '@mui/icons-material/Key';
import Logout from '@mui/icons-material/Logout';
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ChangePassword from './ChangePassword'
import {NavLink,useParams} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from 'react-router-dom'
import apiUrl from '../api'

const theme = createTheme();

theme.typography.h6 = {
  fontSize: '1.0rem',
 
};

const Navbar = (props) => {
const {id}=useParams();
let navigate=useNavigate()
  const [userInfo,setUserInfo]=useState(()=>JSON.parse(localStorage.getItem('userInfo')))
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [fullName,setFullName]=React.useState('')
  const [image,setImage]=React.useState('')
  
  useEffect(()=>{
    let name=userInfo.firstName+' '+userInfo.lastName
    setFullName(name)
  },[fullName])

useEffect(()=>{
  getUserProfile()
},[])
  
  const getUserProfile = useCallback(async() => {
    const result=await apiUrl.get(`user-profile`).then((function(response) {
     //setUpdateUserObj(response.data.user)
     if(response.data.user.photo === undefined || response.data.user.photo === ''){
      setImage('')

     }else{
      setImage(response.data.user.photo)

     }
 }))
  },[])
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
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout=async()=>{
    navigate('/login');
    localStorage.clear()
  }
  return (
    <>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Social Feed
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {image !== '' ?
                  <>
         <Avatar alt="Remy Sharp" src={`/${image}`} ></Avatar>

                  </>  
                : 
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" >{getInitials(fullName)}</Avatar>

            }
              </IconButton>
              
            </Tooltip>
            
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            
                <MenuItem  onClick={handleCloseUserMenu}>
                <Avatar sx={{ width: 18, height: 18, mr: "5px" }} />
                  <Typography textAlign="left">
                  <NavLink to={{pathname:`/editprofile/${userInfo._id}`, state: {image:'lol'} }} style={{textDecoration:'none',color:'black'}}>Edit Profile</NavLink>
                    </Typography>
                </MenuItem>
                <MenuItem  onClick={handleCloseUserMenu}>
                <Key fontSize="small" sx={{ mr: "5px", color: "#BEBEBE" }} /> <ChangePassword/>
                </MenuItem>
               
                <MenuItem  onClick={handleCloseUserMenu}>
                <Logout
                    fontSize="small"
                    sx={{ mr: "5px" ,color: "#BEBEBE" }}
                  />
                  <Typography textAlign="center" onClick={handleLogout}>Log out</Typography>
                </MenuItem>
             
            </Menu>
          </Box>
          <ThemeProvider theme={theme}>
          <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ ml: 0.5, display: { xs: "none", md: "flex" },fontSize:'100' }}
                >
                 {userInfo.firstName} {userInfo.lastName}
                </Typography>
                </ThemeProvider>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};
export default Navbar;
