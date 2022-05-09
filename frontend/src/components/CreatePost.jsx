import React,{useState} from 'react'
import apiUrl from "../api";
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
function CreatePost(props) {
    const formdata = new FormData();
    const initialState = {
        file: "",
        text: "",
        image: "",
      };
      const [objOfPost, setObjOfPost] = useState(initialState);
      const [errors, setErrors] = useState({file:'',text:''});

      const validate = () => {
        let flag = false;
       
        if (objOfPost.text ==='') {
          console.log('hi')
          setErrors((prevState) => ({
           errors: { ...prevState.errors, text: "Caption cannot be empty" }
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
      function handleChange(e) {
        let url = URL.createObjectURL(e.target.files[0]);
    
        setObjOfPost({ ...objOfPost, file: e.target.files[0], image: url });
    
        if (e.target.files[0] !== "") {
          setErrors({ ...errors, file: "" });
        }
      }
    
      const handleCaptionText = (e) => {
        setObjOfPost({
          ...objOfPost,
          text: e,
        });
    
        if (e === "") {
          setErrors({ ...errors, text: "Caption cannot be empty" });
        }else{
          setErrors({ ...errors, text:''})
        }
      };
    
    
    const handlePostData = async () => {
        formdata.append("profileImg", objOfPost.file);
        formdata.append("caption", objOfPost.text);
    
        if (validate()) {
           await apiUrl.post(`post`, formdata).then((response) => {
            console.log(response.data.post);
            props.setPost((postData) => [response.data.post,...postData]);
    
          });
    
          setObjOfPost({ image: "", text: "" });
        }
      };
  return (
    <div>
      <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Create Post</Typography>
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
                          onChange={(e) => handleCaptionText(e.target.value)}
                        />
                        <Box sx={{ marginLeft: "9rem" }}>
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
    </div>
  )
}

export default CreatePost
