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

    // Extract access token from the nested structure
    const accessToken = response.data?.access_token;

    if (!accessToken) {
      throw "Sign-in failed. Invalid response from server.";
    }

    return {
      accessToken,
      user: credentials.identifier, // Assuming identifier is email or username
    };
  } catch (error) {
    // Handle specific error messages from backend
    if (error.response?.status === 403) {
      throw new Error("Please confirm your email before logging in.");
    } else if (error.response?.status === 400) {
      throw new Error("Invalid credentials.");
    } else {
      throw new Error(error.response?.data?.detail || "Sign-in failed. Please try again later.");
    }
  }
};
