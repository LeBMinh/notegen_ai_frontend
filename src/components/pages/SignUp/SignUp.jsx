import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { signUp } from '../../../server/api';
import { auth, googleProvider, facebookProvider, signInWithPopup } from '../../../auth/Firebase';
import { TextField, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import './SignUp.css';
//import Logo and icons
import NoteGenLogo from '../../../assets/Logo/Full_NG-Logo.svg';
import GoogleIcon from '../../../assets/Others/GoogleIcon.png';
import NGgif from '../../../assets/Others/NG_atSignUp.gif';
import DropHere from '../../../assets/Icon_line/DropHere.svg';

export default function SignUp({ setAuthenticated, setUser, toggleSignIn }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(""); // For Confirm Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // 🔴 Check file type
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG, and JPEG files are allowed!");
        return;
      }

      // 🔴 Check file size limit (1MB)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert("File size must be less than 1MB!");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // Create an offscreen canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas size to 500x500
          canvas.width = 500;
          canvas.height = 500;

          // Resize and draw the image onto the canvas
          ctx.drawImage(img, 0, 0, 500, 500);

          // Convert the canvas content to Base64
          const resizedBase64 = canvas.toDataURL("image/jpeg", 0.6); // 60% quality

          // Show preview
          setSelectedImage(resizedBase64);
        };
      };
    }
  };

  const handleSignUp = async () => {
    if (!fullname || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Convert Image to Base64 if selected
    let base64Image = "";
    if (selectedImage) {
      base64Image = selectedImage;
    }

    setLoading(true);

    try {
      const userData = {
        username: fullname,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        isAdmin: false,  // Default to false
        role: "free",    // Default to "free"
        profile_picture: base64Image || "notSelected"
      };

      const response = await signUp(userData);

      console.log("Sign-up successful:", response);
      setUser(response);
      // setAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response));

      alert("Kindly check your inbox or spam email and click the verification link to complete your registration.");
      toggleSignIn(); // Switch to SignIn after successful sign-up
    } catch (error) {
      console.error("Sign-up failed:", error);
      alert(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User Info:", result.user);
      setUser(result.user); // Save user data to state
      setAuthenticated(true); // Set authenticated to true after successful login
      localStorage.setItem('user', JSON.stringify(result.user));
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
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
          {/* Upload Image Field */}
          <div className="signup-imageUploader-container">
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="imageUpload"
            />

            {/* Upload Box */}
            <label htmlFor="imageUpload" className="signup-upload-box">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="signup-preview-image" />
              ) : (
                <>
                  <img src={DropHere} alt="DropHere Icon" className="signup-dropHere-icon" />
                  <p>Upload your profile picture here</p>
                </>
              )}
            </label>
          </div>

          <div className='signup-fields-container'>
            {/* Full Name Field */}
            <TextField
              id="outlined-fullname"
              sx={{
                m: 1,
                width: '30ch',
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px", // Set your desired border radius
                  height: "50px",
                },
              }}
              label="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              margin="normal"
              className='signup-input'
            />

            {/* Email Field */}
            <TextField
              id="outlined-email"
              sx={{
                m: 1,
                width: '30ch',
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "50px",
                },
              }}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              className='signup-input'
            />

            {/* Password Field with Visibility Toggle */}
            <TextField
              sx={{
                m: 1,
                width: "30ch",
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
              className='signup-input'
            />

            {/* Confirm Password Field */}
            <TextField
              sx={{
                m: 1,
                width: "30ch",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "50px",
                },
              }}
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility} // Use separate function
                      edge="end"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='signup-input'
            />
          </div>
        </div>
        <button onClick={handleSignUp} className="new-signup-button" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign up an Account"}
        </button>

        <p className="signup-tagline">
          Already have an account? <span onClick={() => toggleSignIn()}>Sign in</span>
        </p>

        {/* <Divider sx={{ width: "50%", color: "rgba(0, 0, 0, 0.6)" }}>or</Divider>

        <div className="signup-options">
          <button onClick={handleGoogleSignIn} className="signup-button" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : <img src={GoogleIcon} alt="Google Icon" className="signup-google-icon" />}
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div> */}
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
