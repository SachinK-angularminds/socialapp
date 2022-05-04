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
import { useNavigate, useLocation } from "react-router-dom";
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

  const [errors, setErrors] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [image, setImage] = useState("");
  const [fullName, setFullName] = React.useState("");

  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const getAllPosts = async () => {
    const result = await apiUrl.get(`post/getAllPosts?page=1&size=5`)
    let obj={}
    let temparr=[]
    console.log(result.data.posts)
    for(let i = 0; i < result.data.posts.length; i++) {
       obj={...result.data.posts[i],expanded:false,commentValue:'',likelength:''}
       console.log(obj)
       temparr[i]=obj
    }
   setPost(temparr)
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
  //infinite scroll bar logic
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prevY, setprevY] = useState(0);
  const [page, setPage] = useState(0);

 
  useEffect(() => {
    getPhotos(page);

    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    let observer;
    observer = new IntersectionObserver(handleObserver, options);
    const element = document.querySelector("#scrollable");

    
    observer.observe(element);
  }, []);
  function getPhotos(page) {
    setLoading(true);
    axios
      .get(
        `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
      )
      .then((res) => {
        setPhotos([...photos, ...res.data]);
        setLoading(false);
      });
  }

  function handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (prevY > y) {
      const lastPhoto = photos[photos.length - 1];
      const curPage = lastPhoto.albumId;
      getPhotos(curPage);
      setPage(curPage);
      // this.setState({ page: curPage });
    }
    //this.setState({ prevY: y });
    setprevY(y);
  }

  const loadingCSS = {
    height: "100px",
    margin: "30px",
  };

  const loadingTextCSS = { display: loading ? "block" : "none" };

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

  const handleExpandClick = (id) => {
    let postArr1 = [...post];
    console.log(id)
    console.log(postArr1)
    for (let i = 0; i < postArr1.length; i++) {
      if (postArr1[i]._id === id) {
        postArr1[i].expanded = !postArr1[i].expanded;
      }
    }
    setPost(postArr1);
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
      .then((response) => {
        console.log(response);
      });

    for (let i = 0; i < postArr.length; i++) {
      console.log(postArr[i]._id);
      if (postArr[i]._id === id) {
        console.log(commentValue);
        postArr[i].comments.push(commentValue);
        postArr[i].commentValue=''
      }
    }
    setPost(postArr);
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
  const handleLikeButton = async (id) => {
    const postLike=[...post]
    const result = await apiUrl.put(`post/like/${id}`);
    for (let i = 0; i < postLike.length; i++) {
      console.log(postLike[i]._id);
      if (postLike[i]._id === id) {
          postLike[i].likelength=postLike[i].likelength.length
      }
    }
  };
  console.log(post)
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
        let obj = { ...response.data.post, expanded: false,commentValue:'',likelength:'' };
        setPost((postData) => [...postData, obj]);
      });
      // setPostData((postData) => [...postData, objOfPost]);
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
          post.map((data,index) => {
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<FavoriteBorderIcon />}
                          checkedIcon={<FavoriteIcon sx={{ color: "red" }} />}
                          name="checkedH"
                          onChange={() => handleLikeButton(data._id)}
                        />
                      }
                    />

                    <ExpandMore
                      expand={data.expanded}
                      onClick={() => handleExpandClick(data._id)}
                      aria-expanded={data.expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>

                  <Collapse in={data.expanded} timeout="auto" unmountOnExit>
                    {data.comments.map((commentvalue) => {
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
                            <Typography>{commentvalue}</Typography>
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

        <div style={{ minHeight: "800px" }}>
          {photos.map((user, i) => (
            <>
              <img
                key={i}
                src={user.url}
                height="100px"
                width="200px"
                alt="null"
              />
            </>
          ))}
        </div>
        <div
          // ref={loadingRef}
          style={loadingCSS}
          id="scrollable"
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </Grid>
    </div>
  );
}

export default Feeds;
