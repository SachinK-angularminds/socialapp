import React, { useEffect, useState, useRef } from "react";
import {
  Accordion,
  Card,
  Grid,
  TextareaAutosize,
  Box,
  CardContent,
  TextField,
  CardMedia,
  CardActionArea,
  CardActions,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Avatar,
  FormControlLabel,
  Checkbox,
  Collapse,
  CardHeader,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import apiUrl from "../api";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
function Feeds() {
  const formdata = new FormData();
  let navigate = useNavigate();
  const initialState = {
    file: "",
    text: "",
    image: "",
  };
  const [objOfPost, setObjOfPost] = useState(initialState);
  let [post, setPost] = useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [ind, setInd] = useState(-1);
  const [errors, setErrors] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [image, setImage] = useState("");
  const [fullName, setFullName] = React.useState("");
  const [like, setLike] = useState(false);
  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const getAllPosts = async () => {
    const result = await apiUrl.get(`post/getAllPosts?page=1&size=5`);
    let obj = {};
    let temparr = [];
    console.log(result.data.posts);
    // for(let i = 0; i < result.data.posts.length; i++) {
    //    obj={...result.data.posts[i],expanded:false,commentValue:'',likelength:result.data.posts[i].like.length}
    //    temparr[i]=obj
    // }
    setPost(result.data.posts);
  };
  useEffect(() => {
    getUserProfile();
    getAllPosts();
  }, []);
  useEffect(() => {
    let name = userInfo.firstName + " " + userInfo.lastName;
    setFullName(name);
  }, [fullName]);

  const getUserProfile = async () => {
    const result = await apiUrl.get(`user-profile`).then(function (response) {
      if (
        response.data.user.photo === undefined ||
        response.data.user.photo === ""
      ) {
        setImage("");
      } else {
        setImage(response.data.user.photo);
      }
    });
  };
 

  function handleChange(e) {
    let url = URL.createObjectURL(e.target.files[0]);
    console.log(url);

    setObjOfPost({ ...objOfPost, file: e.target.files[0], image: url });
    console.log(url);

    if (e.target.files[0] !== "") {
      setErrors({ ...errors, file: "" });
    }
  }

  const handleCaptionText = (e) => {
    setObjOfPost({
      ...objOfPost,
      text: e.target.value,
    });

    if (e.target.value !== "") {
      setErrors({ ...errors, text: "" });
    }
  };

  
  const handleExpand = (index) => {
    // for (let i = 0; i < post.length; i++) {
    //   if (i === index) {
    //     console.log(i);
    //     console.log(index);
    //     // setExpanded(!expanded)
    //   }
    // }
    setInd(index);
    setExpanded(!expanded);
  };

  const handleCommentValue = (event, id) => {
    let postArr = [...post];

    for (let i = 0; i < postArr.length; i++) {
      console.log(postArr[i]._id);
      if (postArr[i]._id === id) {
        console.log(commentValue);
        postArr[i].commentsValue = event;
      }
    }
    setPost(postArr);
  };
  const handlePostComments = async (id) => {
    let postArr = [...post];
    const result = await apiUrl
      .put(`post/comment/${id}`, { comment: commentValue })
      

      for(let i=0; i<postArr.length; i++) {
        if(postArr[i]._id === id){
          postArr[i]=result.data.postsComment
        }
      }
      setPost(postArr)
      console.log(result.data.postsComment)

    // for (let i = 0; i < postArr.length; i++) {
    //   console.log(postArr[i]._id);
    //   if (postArr[i]._id === id) {
    //     console.log(commentValue);
    //     postArr[i].comments.push(commentValue);
    //     postArr[i].commentValue = "";
    //   }
    // }
    // setPost(postArr);
    setCommentValue("");
  };

  const validate = () => {
    let flag = false;

    if (objOfPost.text === "") {
      setErrors((prevState) => ({
        errors: { ...prevState.errors, text: "Caption cannot be empty" },
      }));
      flag = true;
    }
    if (objOfPost.file === "") {
      setErrors((prevState) => ({
        ...prevState.errors,
        file: "Upload Image",
      }));
      flag = true;
    }

    if (flag) {
      return false;
    } else {
      return true;
    }
  };
  const handleLikeButton = async (event, id) => {
    let postArr = [...post];

    const result = await apiUrl.put(`post/like/${id}`);
    for(let i=0; i<postArr.length; i++) {
      if(postArr[i]._id === id){
        postArr[i]=result.data.postsLike
      }
    }
    setPost(postArr)
    console.log(result.data);
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
  const handlePostData = async () => {
    formdata.append("profileImg", objOfPost.file);
    formdata.append("caption", objOfPost.text);
    //formdata.append('userId',userInfo._id)

    if (validate()) {
      const result = await apiUrl.post(`post`, formdata).then((response) => {
        console.log(response.data.post);
        setPost((postData) => [...postData, response.data.post]);

        // setPost(response.data.post);
      });
      setObjOfPost({ image: "", text: "" });
    }
  };
    return (
    <div style={{ backgroundColor: "#e6f2ff" }}>
      <Navbar />
      <Box sx={{ display: "flex", alignItems: "start" }}>
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Accordion 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box component="main" width="auto" height="auto">
                  <Box>
                    <h1 style={{ margin: 3 }}>Upload an Image</h1>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          id="outlined-full-width"
                          label="Image Upload"
                          style={{ margin: 8 }}
                          name="upload-photo"
                          type="file"
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          error={errors.file ? true : false}
                          helperText={errors.file}
                          onChange={handleChange}
                        />
                        {objOfPost.image.length > 0 && (
                          <Card>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="140"
                                image={objOfPost.image}
                                title="Contemplative Reptile"
                                commentValue
                              />
                            </CardActionArea>
                          </Card>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={4}
                          placeholder="Caption"
                          value={objOfPost.text}
                          style={{ width: "30em" }}
                          onChange={(e) => handleCaptionText(e)}
                        />
                        <Box sx={{ marginLeft: "1.2rem" }}>
                          <Typography
                            align="left"
                            sx={{ color: "red", fontSize: "0.8rem" }}
                          >
                            {errors.text}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <CardActions disableSpacing>
                      <Button variant="contained" onClick={handlePostData}>
                        Post
                      </Button>
                    </CardActions>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: "100vh", marginTop: "" }}
      >
        {post &&
          post.map((data, index) => {
            return (
              <>
                <Card key={data._id} sx={{ width: 345, mb: 3 }}>
                  <CardHeader
                    avatar={
                      <>
                        {image !== "" ? (
                          <>
                            <Avatar alt="Remy Sharp" src={`/${image}`}></Avatar>
                          </>
                        ) : (
                          <Avatar
                            alt="Remy Sharp"
                            sx={{ bgcolor: red[500] }}
                            src="/static/images/avatar/2.jpg"
                          >
                            {getInitials(fullName)}
                          </Avatar>
                        )}

                        <Typography sx={{ margin: 1 }}>{fullName}</Typography>
                      </>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItem: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      style={{ width: "24rem", maxHeight: "240px" }}
                      image={`/${data.profileImg}`}
                      alt="Paella dish"
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {data.caption}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                  
                    <IconButton
                      aria-label="add to favorites"
                      style={{
                        color: `${
                          data.like.includes(userInfo._id) ? "red" : ""
                        }`,
                      }}
                      onClick={(e) => handleLikeButton(e, data._id)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <Typography>{data.like.length}</Typography>

                    <ExpandMore
                      expand={ind === index ? expanded : false}
                      onClick={() => handleExpand(index)}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse
                    in={ind === index ? expanded : false}
                    timeout="auto"
                    unmountOnExit
                  >
                    {data.comments.map((commentvalue,i) => {
                      return (
                        <>
                          <Box
                            sx={{
                              margin: 2,
                              display: "flex",
                              alignItems: "start",
                            }}
                          >
                            <Typography style={{ fontWeight: 600 }}>
                              {fullName} :
                            </Typography>
                            <Typography>{commentvalue.comment}</Typography>
                          </Box>
                        </>
                      );
                    })}
                    <Grid container>
                      <Grid item xs={10} sx={{ marginTop: "-1rem" }}>
                        <CardContent>
                          <TextField
                            id="standard-basic"
                            label="Comments"
                            value={commentValue}
                            variant="standard"
                            onChange={
                              ((e) =>
                                handleCommentValue(e.target.value, data._id),
                              (e) => setCommentValue(e.target.value))
                            }
                            fullWidth
                          />
                        </CardContent>
                      </Grid>
                      <Grid item xs={2} sx={{ marginTop: "1rem" }}>
                        <Button onClick={(e) => handlePostComments(data._id)}>
                          Post
                        </Button>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Card>
              </>
            );
          })}

        
      </Grid>
    </div>
  );
}

export default Feeds;
