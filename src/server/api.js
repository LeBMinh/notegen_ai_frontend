import axios from "axios";

const API_BASE_URL = "https://notegenai-backend.onrender.com"; // Replace with your Swagger backend URL

//=======================AUTHENTICATION============================//
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
    const userId = response.data?.body?.data?.user_id;

    if (!accessToken || !userId) {
      throw "Sign-in failed. Invalid response from server.";
    }

    return {
      accessToken,
      user: credentials.identifier, // Assuming identifier is email or username
      userId,
      isAdmin, // Include isAdmin flag

    };
  } catch (error) {
    // Handle specific error messages from backend
    if (error.response?.status === 403) {
      throw new Error("Please confirm registration in your inbox or spam email before logging in.");
    } else if (error.response?.status === 400) {
      throw new Error("Invalid credentials.");
    } else {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Sign-in failed. Please try again later.";
      throw new Error(errorMessage);
    }
  }
};


// Get all Users
export const getAllUsers = async () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    console.error("No access token found.");
    return [];
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log("Full API response:", response.data); // Debugging
    return response.data.body?.data || [];
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    return [];
  }
};


// Get user details by ID
export const getUserDetails = async (userId, token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/users-by-id/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // console.log("Full API response:", res.data); // Debugging
    return res.data.body?.data; // Adjust this based on actual API response
  } catch (error) {
    console.error("Failed to get user details:", error);
    return {}; // Return an empty object if fetching fails
  }
};


//=======================GEMINI AI============================//
export const processTextWithGemini = async (text, fileId) => {
  try {
    const accessToken = localStorage.getItem("access_token");

      const response = await axios.post(`${API_BASE_URL}/ai/gemini`, null, {
          params: {
            text: encodeURIComponent(text),
            file_id: encodeURIComponent(fileId),
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
      });

      return response.data;
  } catch (error) {
      console.error("Error processing text with Gemini:", error);
      throw error;
  }
};

//=======================STORAGE============================//
// Function to get token from localStorage 
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token"); 
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// 📂 Create a New Folder
export const createFolder = async (name) => {
  try {
    // console.log("Sending to API:", { name, parent_id: null }); // Debugging

    const response = await axios.post(
      `${API_BASE_URL}/storage/create-folder?name=${encodeURIComponent(name)}&parent_id=`, 
      {}, // No request body
      getAuthHeaders()
    );
    
    console.log("API response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

// 📄 Create a New File (Note)
export const createFile = async (folderId, fileName) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found. Please log in.");
  }

  console.log("Sending request with folderId:", folderId); // Debugging

  try {
    const response = await axios.post(
      `${API_BASE_URL}/storage/create-file?name=${encodeURIComponent(fileName)}`,
      {
        folder_id: folderId ?? null, // Explicitly set null instead of undefined
        name: fileName ?? "Untitled note", // Ensure name is always provided
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Request Payload:", {
      folder_id: folderId ?? null, 
      name: fileName ?? "Untitled note",
    });
    
    console.log("Note data:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error creating file:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create file.");
  }
};

// 📄 Create a New File (with assigned Folder)
export const createFileWithFolder = async (folderId, fileName) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found. Please log in.");
  }

  console.log("Sending request with folderId:", folderId); // Debugging

  try {
    const queryParams = new URLSearchParams({
      name: fileName,
      folder_id: folderId ?? "", // Ensure `null` is handled properly
    }).toString();

    const response = await axios.post(
      `${API_BASE_URL}/storage/create-file?${queryParams}`,
      {}, // No need for a request body since all params are in the query
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Note data:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error creating file:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create file.");
  }
};


// 📑 Retrieve All Files & Folders
export const retrieveStorage = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/storage/retrieve`,
      { params: { in_trash: false }, ...getAuthHeaders() }
    );
    // console.log("Storage data:", response.data); //Debugging
    return response.data;
  } catch (error) {
    console.error("Error retrieving storage:", error);
    throw error;
  }
};

// 🔍 Retrieve File/Folder by ID
export const retrieveById = async (obj_id, is_file = true) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/storage/retrieve-by-id`,
      { params: { obj_id, is_file }, ...getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving by ID:", error);
    throw error;
  }
};

// 📝 Update File Content 
export const updateFileContent = async (file_id, new_content) => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("No access token found. Please log in.");
    }

    // Encode new_content properly for URL
    const encodedContent = encodeURIComponent(new_content);

    // Construct query parameters correctly
    const url = `${API_BASE_URL}/storage/update-file-content?file_id=${file_id}&content_type=original&new_content=${encodedContent}`;

    // console.log("Sending update request to:", url);   //Debugging

    const response = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "text/plain", // Ensure correct content type
        "Content-Type": "application/json",
      },
    });

    // console.log("Update response:", response.data);   //Debugging
    return response.data;
  } catch (error) {
    console.error("Error updating file content:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update file content.");
  }
};


//  Move File not Folder
export const moveFile = async (itemId, newParentId, folderId = null) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/storage/move-item`, null, {
      params: {
        item_id: itemId,
        folder_id: folderId,
        new_parent_id: newParentId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error moving file:", error);
    throw error;
  }
};

// Rename File or Folder
export const renameStorageItem = async (itemId, folderId, newName) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await axios.put(
      `${API_BASE_URL}/storage/rename-item`,
      null,
      {
        params: {
          item_id: itemId,
          folder_id: folderId,
          new_name: newName,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // console.log("Rename response:", response.data);  //Debugging
    return response.data;
  } catch (error) {
    console.error("Error renaming storage item:", error);
    throw error;
  }
};


// Delete File or Folder
export const deleteStorageItem = async (itemId, folderId) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await axios.delete(`${API_BASE_URL}/storage/move-to-trash`, {
      params: {
        item_id: itemId,
        folder_id: folderId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting storage item:", error);
    throw error;
  }
};

// 📑 Retrieve All Files & Folders for Trash page
export const retrieveTrashStorage = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/storage/retrieve`,
      { params: { in_trash: true }, ...getAuthHeaders() }
    );
    // console.log("Storage data:", response.data); //Debugging
    return response.data;
  } catch (error) {
    console.error("Error retrieving storage:", error);
    throw error;
  }
};

// Recover either a file or a folder from the trash
export const recoverFromTrash = async ({ itemId = null, folderId = null }) => {
  try {
    if (!itemId && !folderId) {
      throw new Error("Either itemId or folderId must be provided.");
    }

    const params = itemId ? { item_id: itemId } : { folder_id: folderId };

    const response = await axios.put(`${API_BASE_URL}/storage/recover-from-trash`, null, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error recovering from trash:", error);
    throw error;
  }
};

// Clear all file and folder in trash
export const clearTrash = async () => {
  try {
    const token = localStorage.getItem("access_token"); // Get the token

    const response = await axios.delete(`${API_BASE_URL}/storage/empty-trash`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token in Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error clearing trash:", error);
    throw error;
  }
};

//=======================VietQR PAYMENTS====================//
// Generate Payment QR Code
export const generatePaymentQR = async (amount, note, bankAccount, bankId, token) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/vietqr/generate`, {
        amount,
        note,
        bank_account: bankAccount,
        bank_id: bankId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // console.log("QR Code API response:", res.data);   //Debugging
    return res.data.body?.data?.qr_code || null;
  } catch (error) {
    console.error("Failed to generate payment QR:", error);
    return null;
  }
};

// Get all payment history
export const getPaymentHistory = async (userId = "all") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/vietqr/history`, {
      params: { user_id: userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

// Confirm payment only in admin page
export const confirmPayment = async (confirmationCode) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/vietqr/confirm-payment`,
      null, // No body since it's a query parameter
      {
        params: { confirmation_code: confirmationCode },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error.response?.data || error);
    throw error;
  }
};