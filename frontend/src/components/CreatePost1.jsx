import React,{useState} from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import apiUrl from "../api";
import {
    Card,
    Grid,
    TextareaAutosize,
    Box,
    TextField,
    CardMedia,
    CardActionArea,
    CardActions,
    Button,
    Typography,
  } from "@mui/material";
  import Tooltip from '@mui/material/Tooltip';
 
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
function CreatePost1(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
    setObjOfPost(initialState)    
        setOpen(false)
    };
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
          handleClose()
        }
      };
    
  return (
      <div >

    <Button onClick={handleOpen}><Tooltip title="Create Post">
<AddCircleIcon fontSize='large'/></Tooltip></Button>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
         Upload an Image
        </Typography>
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
                          <Card sx={{mb:3,marginLeft:"0.5rem"}}> 
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
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={4}
                          placeholder="Caption"
                          value={objOfPost.text}
                          style={{ marginLeft:'0.6rem',width: "29.7em" }}
                          onChange={(e) => handleCaptionText(e.target.value)}
                        />
                        <Box sx={{ marginLeft: "0.5rem",mt:1 }}>
                          <Typography
                            align="left"
                            sx={{ color: "red", fontSize: "0.8rem" }}
                          >
                            {errors.text}
                          </Typography>
                        </Box>
                        <Box sx={{mt:1,marginLeft: "0.5rem"}}>
                        <Button variant="contained" onClick={handlePostData}>
                        Post
                      </Button>
                        </Box>
                        
      </Box>
    </Modal>
    </div>
  )
}

export default CreatePost1