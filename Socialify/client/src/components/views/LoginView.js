import {
  Alert,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/users";
import ErrorAlert from "../ErrorAlert";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../Copyright";

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(formData);
    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
   <Container maxWidth={"xs"} sx={{ mt: 6 }}>
  <Stack alignItems="center">
    <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
      <Link to="/" color="inherit" underline="none" style={{color:"green"}}>
        Socialify
      </Link>
    </Typography>
    <Typography variant="h5" gutterBottom style={{color:"green"}}>
      Login
    </Typography>
    <Typography color="text.secondary" style={{color:"green"}}>
      Don't have an account yet? <Link to="/signup">Sign Up</Link>
    </Typography>
    <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px' }}>
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        autoComplete="email"
        autoFocus
        required
        id="email"
        name="email"
        onChange={handleChange}
        sx={{ backgroundColor: 'white', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}
      />
      <TextField
        label="Password"
        fullWidth
        required
        margin="normal"
        id="password"
        name="password"
        onChange={handleChange}
        type="password"
        sx={{ backgroundColor: 'white', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}
      />

      <ErrorAlert error={serverError} />
      <Button type="submit" fullWidth variant="contained" sx={{ my: 2, backgroundColor: 'white', boxShadow: '0px 0px 3px (0, 0, 0, 0.1)', color: 'green', borderRadius: '5px' }}>
        Login
      </Button>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Copyright />
    </Box>
  </Stack>
</Container>

  );
};

export default LoginView;
