import {
  Button,
  Card,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import ErrorAlert from "./ErrorAlert";
import { isLoggedIn } from "../helpers/authHelper";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";

const PostEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const user = isLoggedIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const data = await createPost(formData, isLoggedIn());
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
    }
  };

  const validate = () => {
    const errors = {};

    return errors;
  };

  return (
   <Card sx={{ border: '1px solid green', borderRadius: '10px', boxShadow: '0px 0px 10px white' }}>
  <Stack spacing={1} sx={{ padding: '20px', borderRadius: '10px' }}>
    {user && (
      <HorizontalStack spacing={2}>
        <UserAvatar width={50} height={50} username={user.username} />
        <Typography variant="h5" style={{color:"blue"}}>
          What would you like to post today {user.username}?
        </Typography>
      </HorizontalStack>
    )}

    <Typography style={{ color: "green" }}>
      <a href="https://commonmark.org/help/" target="_blank" style={{color:"green"}}>
        Markdown Help
      </a>
    </Typography>

    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Title"
        required
        name="title"
        margin="normal"
        onChange={handleChange}
        error={errors.title !== undefined}
        helperText={errors.title}
        sx={{ marginBottom: '15px', color: "green", boxShadow: "0px 0px 3px green(0, 0, 0, 0.1)" }}
      />
      <TextField
        fullWidth
        label="Content"
        multiline
        rows={10}
        name="content"
        margin="normal"
        onChange={handleChange}
        error={errors.content !== undefined}
        helperText={errors.content}
        required
        sx={{ marginBottom: '15px', color: "green", boxShadow: "0px 0px 3px green(0, 0, 0, 0.1)" }}
      />
      <ErrorAlert error={serverError} />
      <Button
        variant="outlined"
        type="submit"
        fullWidth
        disabled={loading}
        sx={{
          marginTop: '15px',
          color: "green",
          boxShadow: "0px 0px 3px green(0, 0, 0, 0.1) ",
          border:"green"
        }}
      >
        {loading ? <>Submitting</> : <div style={{ color: "green", boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)" }}>Submit</div>}
      </Button>
    </Box>
  </Stack>
</Card>


  );
};

export default PostEditor;
