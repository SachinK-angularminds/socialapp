import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Box,
  CardContent,
  TextField,
  CardMedia,
  CardActions,
  IconButton,
  Avatar,
  Collapse,
  CardHeader,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost";
import CreatePost1 from "./CreatePost1";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InfiniteScroll from "react-infinite-scroll-component";
import apiUrl from "../api";
import Loading from "./Loading";
import CommentIcon from '@mui/icons-material/Comment';

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
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Feeds(props) {
  let navigate = useNavigate();
 
  let [post, setPost] = useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [expandedComment, setExpandedComment] = React.useState(false);

  const [ind, setInd] = useState(-1);
  const [commentindex,setCommentIndex]=useState(-1)
  const [pageNumber, setPageNumber] = useState(2);
  const [commentValue, setCommentValue] = useState("");
  const [image, setImage] = useState("");
  const [fullName, setFullName] = React.useState("");
  const [allUsers,setAllUsers]=useState([])
  const [hasMore, setHasMore] = useState(true);
  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setOpenLogin(false);
  };

  
  const getAllPosts = async () => {
    const result = await apiUrl.get(`post/getAllPosts?page=${pageNumber}&size=3`);
       return result.data.posts
  };

  const getAFirstPosts = async () => {
    const result = await apiUrl.get(`post/getAllPosts?page=1&size=3`);
    setTimeout(() => {
      setPost(result.data.posts);
    }, 500);

    return result.data.posts
  };


  const fetchData=async()=>{
    const dataFromServer=await getAllPosts()
      setPost([...post, ...dataFromServer]);
        if (dataFromServer.length<2 || dataFromServer.length ===0) {
          setHasMore(false);
         }
    setPageNumber(pageNumber+1);
  }
  useEffect(() => {
    getUserProfile();
    getAFirstPosts();
    getAllUsers()
  }, []);


  const getAllUsers = async () => {
    const result = await apiUrl.get(`getAllUsers`);
    setAllUsers(result.data.user)
  };

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
  const handleExpand = (index) => {
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
    const result = await apiUrl.put(`post/comment/${id}`, {
      comment: commentValue,
    });

    for (let i = 0; i < postArr.length; i++) {
      if (postArr[i]._id === id) {
        postArr[i] = result.data.postsComment;
      }
    }
    setPost(postArr);
    setCommentValue("");
    setExpanded(false)
  };

  const handleLikeButton = async (event, id) => {
    let postArr = [...post];
    const result = await apiUrl.put(`post/like/${id}`);
    for (let i = 0; i < postArr.length; i++) {
      if (postArr[i]._id === id) {
        postArr[i] = result.data.postsLike;
      }
    }
    setPost(postArr);
    console.log(result.data);
  };

  const handleCommentButton=(index)=>{
    setCommentIndex(index)
    setExpandedComment(!expandedComment)
  }
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
  
 console.log(post)
 
  return (
    <div style={{ backgroundColor: "#e6f2ff" }}>
      <Navbar image={image}/>
      <Box sx={{ display: "flex", alignItems: "start" }}>
        {/* <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <CreatePost post={post} setPost={setPost}/>
         </Grid>
        </Grid> */}
      </Box>
      <Box sx={{marginLeft:"46rem"}}>
        <CreatePost1 post={post} setPost={setPost}/>
      </Box>
      <InfiniteScroll
        dataLength={post.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<Loading />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          style={{ minHeight: "100vh", marginTop: ""}}
        >
          {post &&
            post.map((data, index) => {
              return (
                <>
                  <Card key={data._id} sx={{ width: 545, mb: 3 ,boxShadow:9 }}>
                    <CardHeader
                      avatar={
                        <>
                        {allUsers.map((user,indexvalue)=>(
                            data.createdBy === user._id?
                                  user.hasOwnProperty('photo')?
                              <Avatar
                              alt={data.userName}
                              src={`/${user.photo}`}
                            ></Avatar>
                              :
                              <>
                           <Avatar
                            sx={{ bgcolor: red[500] }}
                          >
                         { getInitials(data.userName)} 
                          </Avatar>
                             </>
                          :
                          ''
                        ))}
                        <>
                          <Typography sx={{ margin: 1 }}>{data.userName}</Typography>
                        </>
                        </>
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
                        style={{ width: "36rem", maxHeight: "240px" }}
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
                      <Box sx={{marginLeft:"-0.1rem"}}>
                      <ExpandMore
                       // expand={commentindex === index ? expandedComment : false}
                        onClick={() => handleCommentButton(index)}
                        aria-expanded={expandedComment}
                        aria-label="show more"
                      >
                        <CommentIcon />
                      </ExpandMore>
                      </Box>
                      <Typography>{data.comments.length}</Typography>
                    
                     
                    </CardActions>
                    <Collapse
                      in={commentindex === index ? expandedComment : false}
                      timeout="auto"
                      unmountOnExit
                    >
                      {data.comments.map((commentvalue, i) => {
                        return (
                          <>
                            <Box
                              sx={{
                                margin: 2,
                                display: "flex",
                                alignItems: "start",
                              }}
                            >
                              {
                        <>
                        {allUsers.map((user,indexvalue)=>(
                            commentvalue.userId === user._id?
                                  user.hasOwnProperty('photo')?
                              <Avatar
                              alt={data.userName}
                              src={`/${user.photo}`}
                            ></Avatar>
                              :
                              <>
                           <Avatar
                            sx={{ bgcolor: red[500] }}
                          >
                         { getInitials(data.userName)} 
                          </Avatar>
                             </>
                          :
                          ''
                        ))}
                       
                        </>
                      }  
                              <Typography style={{ fontWeight: 600,margin:'0.5rem' }}>
                                {commentvalue.userName} :
                              </Typography>
                              <Typography style={{margin:'0.5rem'}}>{commentvalue.comment}</Typography>
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
      </InfiniteScroll>
     
      <Snackbar open={props.openLogin} autoHideDuration={3000} onClose={handleClose}     anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Login successful!
        </Alert>
      </Snackbar>
      
    </div>
  );
}

export default Feeds;
