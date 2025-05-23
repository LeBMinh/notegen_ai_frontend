import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { signIn } from '../../../server/api';
import { auth, googleProvider, signInWithPopup } from '../../../auth/Firebase';
import { TextField, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import './SignIn.css';
import NoteGenLogo from '../../../assets/Logo/Full_NG-Logo.svg';
import GoogleIcon from '../../../assets/Others/GoogleIcon.png';
import NGgif from '../../../assets/Others/NG_atSignUp.gif';
import { PATH_NAME } from '../../../router/Pathname';

export default function SignIn({ setAuthenticated, setUser, toggleSignUp }) {
  const [loginInfo, setLoginInfo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    if (!loginInfo || !password) {
      alert("Please enter your email/username and password.");
      return;
    }

    setLoading(true);  // Start loading

    try {
      const credentials = {
        identifier: loginInfo, // Accepts either email or username
        password: password
      };

      const response = await signIn(credentials);

      console.log("Sign-in successful:", response);

      setAuthenticated(true);
      setUser(response.user);

      // Store token in localStorage for future API calls
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('isAdmin', response.isAdmin ? "true" : "false"); // ✅ Store separately
      // localStorage.setItem('user', JSON.stringify(response.user)); 
      localStorage.setItem('user', JSON.stringify({
        username: response.user,  // Because user is just a string (user101)
        userId: response.userId,  // Store userId properly
        isAdmin: response.isAdmin 
      }));
      

      // Redirect based on user role
      if (response.isAdmin) {
        navigate(PATH_NAME.ADMIN_DASHBOARD);
      } else {
        navigate(PATH_NAME.DASHBOARD);
      }

      alert("Sign-in successful!");
    } catch (error) {
      console.error("Sign-in failed:", error);
      setErrorMessage(error.message); // Display error message
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User Info:", result.user);
      setUser(result.user);
      setAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(result.user));
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {/* Left Section */}
      <div className="signin-left-section">
        <div className="signin-illustration">
          <img src={NGgif} alt="NoteGen AI Gif" className="signin-gif" />
          <h2 className="signin-illustration-title">Welcome Back to NoteGen AI</h2>
          <p className="signin-illustration-text">Rediscover your treasure trove of knowledge!</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="signin-right-section">
        <img src={NoteGenLogo} alt="NoteGen AI Logo" className="signin-logo" />
        <h1 className="signin-title">Sign In</h1>

        <div className='signin-form'>
          {/* Full Name or Email Field */}
          <TextField
            id="outlined-loginInfo"
            sx={{
              m: 1,
              width: '35ch',
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", // Set your desired border radius
                height: "50px", // Set desired height for the entire input
              },
            }}
            label="Full Name or Email"
            value={loginInfo}
            onChange={(e) => setLoginInfo(e.target.value)}
            margin="normal"
          />
          {/* Password Field with Visibility Toggle */}
          <TextField
            sx={{
              m: 1,
              width: '35ch',
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "50px",
              },
            }}
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button onClick={handleSignIn} className="new-signin-button" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </button>
        </div>

        <p className="signin-tagline">
          Don't have an account? <span onClick={() => toggleSignUp()}>Sign up</span>
        </p>

        <div className="startPage-user-warning" style={{marginTop: "10px"}}>
          <p>⚠️ Your token will expire <strong>24h</strong> after sign in. <br />
            If the page isn't working, just sign in again. Thanks! 🤗</p>
        </div>


        {/* <Divider sx={{ width: "50%", color: "rgba(0, 0, 0, 0.6)" }}>or</Divider>

        <div className="signin-options">
          <button onClick={handleGoogleSignIn} className="signin-button" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : <img src={GoogleIcon} alt="Google Icon" className="signin-google-icon" />}
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div> */}
      </div>
    </div>
  );
}
