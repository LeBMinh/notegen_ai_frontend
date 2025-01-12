import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider, signInWithPopup } from '../../../auth/Firebase';
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import './SignUp.css';
import NoteGenLogo from '../../../assets/Logo/Full_NG-Logo.svg';
import GoogleIcon from '../../../assets/Others/GoogleIcon.png';
import NGgif from '../../../assets/Others/NG_atSignUp.gif';

export default function SignUp({ setAuthenticated, setUser, toggleSignIn }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      setUser(userCredential.user);
      setAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userCredential.user));
    } catch (error) {
      console.error("Sign-up failed:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User Info:", result.user);
      setUser(result.user); // Save user data to state
      setAuthenticated(true); // Set authenticated to true after successful login
      localStorage.setItem('user', JSON.stringify(result.user));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const handleFacebookSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, facebookProvider);
  //     console.log("User Info:", result.user);
  //     setUser(result.user); // Save user data to state
  //     setAuthenticated(true);
  //     const credential = facebookProvider.credentialFromResult(result);
  //     const accessToken = credential.accessToken;
  //     localStorage.setItem('user', JSON.stringify(result.user));
  //   } catch (error) {
  //     console.error("Facebook login failed:", error);
  //     const credential = facebookProvider.credentialFromError(error);
  //   }
  // };

  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-left-section">
        <img src={NoteGenLogo} alt="NoteGen AI Logo" className="signup-logo" />
        <h1 className="signup-title">Sign up</h1>
        {/* <p className="signup-tagline">
            Unlock your potential by turning your notes into action. <br />
            Every note is a step toward mastering your goals!
          </p> */}

        <div className='signup-form'>
          {/* Full Name Field */}
          <TextField
            id="outlined-fullname"
            sx={{
              m: 1,
              width: '35ch',
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", // Set your desired border radius
                height: "52px",
              },
            }}
            label="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            margin="normal"
          />
          {/* Email Field */}
          <TextField
            id="outlined-email"
            sx={{
              m: 1,
              width: '35ch',
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", 
                height: "52px",
              },
            }}
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          {/* Password Field with Visibility Toggle */}
          <TextField
            sx={{
              m: 1,
              width: '35ch',
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", 
                height: "52px",
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
          <button onClick={handleSignUpWithEmail} className="new-signup-button">
            Sign up an Account
          </button>
        </div>

        <p className="signup-tagline">
          Already have an account? <span onClick={() => toggleSignIn()}>Sign in</span>
        </p>

        <Divider sx={{ width: "50%", color: "rgba(0, 0, 0, 0.6)" }}>or</Divider>

        <div className="signup-options">
          <button onClick={handleGoogleSignIn} className="signup-button">
            <img src={GoogleIcon} alt="Google Icon" className="signup-google-icon" />
            Continue with Google
          </button>
        </div>
        <p className="signup-agreement">
          By continuing, you agree to the <span>Terms of Service</span> <br />
          and acknowledge you've read our <span>Privacy Policy</span>.
        </p>
      </div>

      {/* Right Section */}
      <div className="signup-right-section">
        <div className="signup-illustration">
          <img src={NGgif} alt="NoteGen AI Gif" className="signup-gif" />
          <h2 className="signup-illustration-title">Let NoteGen AI</h2>
          <p className="signup-illustration-text">craft your very own treasure trove of knowledge!</p>
        </div>
      </div>
    </div>
  )
}
