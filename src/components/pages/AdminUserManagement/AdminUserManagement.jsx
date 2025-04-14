import React, { useEffect, useState } from "react";
import "./AdminUserManagement.css";
import { TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, InputLabel, FormControl } from "@mui/material";
import { getAllUsers } from "../../../server/api";

// import icons
import TotalUserIcon from "../../../assets/Icon_line/UserTime.svg";
import PremiumUserIcon from "../../../assets/Icon_line/AddUser.svg";
import ExportCSV from '../../../assets/Icon_line/Save_btn.svg';

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersData = await getAllUsers();
                // console.log("Fetched users in AdminUserManagement:", usersData); // Debugging

                if (Array.isArray(usersData) && usersData.length > 0) {
                    // Sort by created_at (newest first)
                    const sortedUsers = usersData.sort(
                        (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    );
                    setUsers(sortedUsers);
                } else {
                    console.warn("Users data is empty or undefined.");
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search & role
    const filteredUsers = users.filter((user) =>
        (user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())) &&
        (roleFilter === "" || user.role === roleFilter) &&
        (dateFilter ? (user.created_at && user.created_at.startsWith(dateFilter)) : true)
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Handle export CSV file
    const handleExportCSV = () => {
        if (users.length === 0) {
            alert("No users to export.");
            return;
        }

        const headers = ["#", "Username", "Email", "Role", "Created At", "Is Admin", "Confirmation"];
        const rows = users.map((user, index) => [
            index + 1,
            user.username,
            user.email,
            user.role,
            new Date(user.created_at + "Z").toLocaleString("en-SG", {
                timeZone: "Asia/Ho_Chi_Minh",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }),
            user.isAdmin ? "Yes" : "No",
            user.confirmation ? "Confirmed" : "Pending",
        ]);

        const csvRows = [headers, ...rows];
        const csvString = csvRows
            .map((row) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        // Add UTF-8 BOM to support Vietnamese characters
        const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "userInfo_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="userManagement-container">
            <h2 className="userManagement-header">Users Management</h2>

            {/* Filter & Statistics Cards */}
            <div className="userManagement-cards">
                <div
                    className={`userManagement-card ${roleFilter === "" ? "active" : ""}`}
                    onClick={() => setRoleFilter("")}
                >
                    <div className="userManagement-user-stat">
                        <img src={TotalUserIcon} alt="Total Users" />
                        <h3>{users.length}</h3>
                    </div>
                    <p>Total Users</p>
                </div>

                <div
                    className={`userManagement-card ${roleFilter === "free" ? "active" : ""}`}
                    onClick={() => setRoleFilter("free")}
                >
                    <div className="userManagement-user-stat">
                        <img src={PremiumUserIcon} alt="Free Users" />
                        <h3>{users.filter(user => user.role === "free").length}</h3>
                    </div>
                    <p>Free Users</p>
                </div>

                <div
                    className={`userManagement-card ${roleFilter === "learner" ? "active" : ""}`}
                    onClick={() => setRoleFilter("learner")}
                >
                    <div className="userManagement-user-stat">
                        <img src={PremiumUserIcon} alt="Learner Users" />
                        <h3>{users.filter(user => user.role === "learner").length}</h3>
                    </div>
                    <p>Learner Users</p>
                </div>

                <div
                    className={`userManagement-card ${roleFilter === "pro" ? "active" : ""}`}
                    onClick={() => setRoleFilter("pro")}
                >
                    <div className="userManagement-user-stat">
                        <img src={PremiumUserIcon} alt="Pro Users" />
                        <h3>{users.filter(user => user.role === "pro").length}</h3>
                    </div>
                    <p>Pro Users</p>
                </div>
            </div>


            {/* Search & Filter Bar */}
            <div className="userManagement-filters">
                <div className="userManagement-filters but-on-the-left">
                    <TextField
                        sx={{
                            width: '30ch',
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px", // Set your desired border radius
                                height: "45px", // Set desired height for the entire input
                            },
                        }}
                        label="Search by username and email"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className='userManagement-exportCSV-btn' onClick={handleExportCSV} >
                        <img src={ExportCSV} alt="ExportCSV Icon" className="exportCSV-icon" />
                        Export UserInfo to CSV
                    </div>
                </div>

                <TextField
                    type="date"
                    size="small"
                    label="Created from"
                    InputLabelProps={{ shrink: true }}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Register confirmation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6}>Loading...</TableCell>
                            </TableRow>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {new Date(user.created_at + "Z").toLocaleString("en-SG", { timeZone: "Asia/Ho_Chi_Minh" })}
                                    </TableCell>
                                    <TableCell>{user.isAdmin ? "✅" : "⬜"}</TableCell>
                                    <TableCell
                                        sx={{
                                            color: "white",
                                            backgroundColor: user.confirmation ? "green" : "orange",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            fontWeight: "bold",
                                            display: "inline-block",
                                            margin: "10px 0 0 20px",
                                        }}
                                    >
                                        {user.confirmation ? "Confirmed" : "Pending"}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>No users found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div className="userManagement-pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
}
