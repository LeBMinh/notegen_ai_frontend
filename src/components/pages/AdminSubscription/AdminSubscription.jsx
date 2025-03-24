import React, { useState, useEffect } from 'react';
import './AdminSubscription.css';
import { confirmPayment, getAllUsers, getPaymentHistory } from "../../../server/api";

// import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';
import MoreDetail from '../../../assets/Icon_line/BackToPrevious.svg';

export default function AdminSubscription() {
  const [transactionId, setTransactionId] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransaction, setLoadingTransaction] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // Track total transaction amount

  const handleConfirmPayment = async () => {
    if (!transactionId) {
      alert("Please enter a transaction ID");
      return;
    }

    setLoadingConfirm(true);

    try {
      const result = await confirmPayment(transactionId);
      console.log("Payment confirmed:", result);

      alert("Payment confirmed successfully!");
      refreshTable(); // Refresh the table after confirmation
    } catch (error) {
      alert("Failed to confirm payment. Please try again.");
    } finally {
      setLoadingConfirm(false);
    }
  };

  // 🔄 Function to Refresh the Table
  const refreshTable = async () => {
    setLoadingTransaction(true); // Show loader while fetching data
    await fetchData(); // Fetch latest transactions
    setLoadingTransaction(false); // Hide loader after fetching
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTransaction(true); // Show loader while fetching

      try {
        const [paymentsResponse, usersData] = await Promise.all([
          getPaymentHistory(),
          getAllUsers(),
        ]);

        // console.log("Raw Payments Response:", JSON.stringify(paymentsResponse, null, 2)); // Debugging

        // Extract actual transactions from the response
        const transactionsArray = Array.isArray(paymentsResponse?.body?.data)
          ? paymentsResponse.body.data
          : [];

        // console.log("Extracted Transactions:", transactionsArray);  // Debugging

        // Match transactions with usernames
        const transactionsWithUsernames = transactionsArray.map((txn, index) => {
          const user = usersData.find((user) => user._id === txn.user_id);
          return {
            ...txn,
            username: user ? user.username : "Unknown User",
            number: index + 1, // Transaction Number
          };
        });

        // Sort transactions by date (latest first)
        transactionsWithUsernames.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        // 🔢 Calculate Total Transaction Sum (only "completed" transactions)
        const total = transactionsWithUsernames
          .filter((txn) => txn.status === "completed") // 🔁 Filter only completed transactions
          .reduce((sum, txn) => sum + txn.amount, 0); // 💹 Sum amounts
        setTotalAmount(total);

        setTransactions(transactionsWithUsernames);
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingTransaction(false); // Hide loader after fetching
      }
    };

    fetchData();
  }, []);

  // Handle Search and Date Filtering
  const filteredTransactions = transactions.filter((txn) => {
    const matchSearch =
      txn.username.toLowerCase().includes(search.toLowerCase()) ||
      txn.confirmation_code.toLowerCase().includes(search.toLowerCase());

    const matchDate =
      (!startDate || new Date(txn.created_at) >= new Date(startDate)) &&
      (!endDate || new Date(txn.created_at) <= new Date(endDate));

    return matchSearch && matchDate;
  });


  return (
    <div className='adminSubscription-container'>
      <div className='adminSubscription-header'>
        <h2>Subscriptions History</h2>

      </div>

      {/* Confirm transaction bar */}
      <div className="adminSubscription-search-bar">
        <input
          type="text"
          placeholder="Enter transaction id here"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="adminSubscription-input"
        />
        <button className="search-btn" onClick={handleConfirmPayment} disabled={loadingConfirm}>
          {loadingConfirm ? (
            <span className="loader"></span>
          ) : (
            <>
              <img src={MagnifyingGlass} alt="Search Icon" className="adminSubscription-seach-icon" />
              Confirm
            </>
          )}
        </button>
      </div>

      <div className='adminSubscription-filter-cards'>

      </div>

      <div className="admin-subscription">
        {/* Search and Date Filter */}
        <div className="admin-subscription-filters">
          <input
            type="text"
            placeholder="Search username or confirmation code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '35%' }}
          />
          <div className="admin-subscription-filter-date">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p> to </p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Total Transactions */}
        <h3>
          Total Transactions ({transactions.filter(txn => txn.status === "completed").length}):
          <span style={{ color: "green" }}> {totalAmount.toLocaleString()} VND</span>
        </h3>

        {/* Transaction List */}
        <div className="admin-subscription-table">
          {loadingTransaction ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            filteredTransactions.map((txn) => (
              <div key={txn._id} className="transaction-card">
                {/* Left Side */}
                <div className="transaction-left">
                  <div className="transaction-username">{txn.number}. {txn.username} ({txn._id})</div>
                  <div className="transaction-note">
                    {txn.note} <strong>{txn.confirmation_code}</strong>
                  </div>
                  <div className="transaction-date">
                    {new Date(txn.created_at + "Z").toLocaleString("en-SG", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </div>
                </div>

                {/* Right Side */}
                <div className="transaction-right">
                  <div className="transaction-amount">+ {txn.amount} VND</div>
                  <div
                    className={`transaction-status ${txn.status === "pending" ? "pending" : "success"
                      }`}
                  >
                    {txn.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
