import axios from "axios";

const API_BASE_URL = "https://notegenai-backend.onrender.com"; // Replace with your Swagger backend URL

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Sign-up failed. Please try again later.";
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);

    // Log response to debug
    // console.log("API response:", response.data); 

    // Extract access token from the nested structure
    const accessToken = response.data?.body?.data?.access_token;
    const isAdmin = response.data?.body?.data?.is_admin;

    if (!accessToken) {
      throw "Sign-in failed. Invalid response from server.";
    }

    return {
      accessToken,
      user: credentials.identifier, // Assuming identifier is email or username
      isAdmin, // Include isAdmin flag

    };
  } catch (error) {
    // Handle specific error messages from backend
    if (error.response?.status === 403) {
      throw new Error("Please confirm your email before logging in.");
    } else if (error.response?.status === 400) {
      throw new Error("Invalid credentials.");
    } else {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Sign-in failed. Please try again later.";
      throw new Error(errorMessage);    
    }
  }
};


// Get all Users


// Get user details by ID
const getUserDetails = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/users- by-id/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data?.body?.data; // Adjust this based on actual API response
  } catch (error) {
    console.error("Failed to get user details:", error);
    return {}; // Return an empty object if fetching fails
  }
};