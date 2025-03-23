import React, { useState, useEffect } from "react";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import "./AdminDashboard.css";
import { getAllUsers, getPaymentHistory } from "../../../server/api";

const COLORS = ["#00C49F", "#0088FE", "#FFBB28"];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [userSubscriptionData, setUserSubscriptionData] = useState([]);
  const [revenueSalesData, setRevenueSalesData] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);

  useEffect(() => {
    // Fetch all users
    async function fetchUsers() {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
        processUserData(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    // Fetch payment history
    async function fetchPayments() {
      try {
        const paymentData = await getPaymentHistory("all"); // Get all transactions
        setPayments(paymentData.body?.data || []);
        processPaymentData(paymentData.body?.data || []);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    }

    fetchUsers();
    fetchPayments();
  }, []);

  // Process users for Subscription Chart & Customer Types
  function processUserData(userData) {
    const monthlyUsers = {}; 
    const roleCount = { free: 0, learners: 0, pro: 0 };

    userData.forEach(user => {
      const createdMonth = new Date(user.created_at || Date.now()).toLocaleString("en-US", { month: "short" });
      monthlyUsers[createdMonth] = (monthlyUsers[createdMonth] || 0) + 1;

      if (user.role === "pro") roleCount.pro += 1;
      else if (user.role === "learner") roleCount.learners += 1;
      else roleCount.free += 1;
    });

    const userSubscriptionChartData = Object.keys(monthlyUsers).map(month => ({
      month,
      newUsers: monthlyUsers[month],
      subscriptions: Math.floor(monthlyUsers[month] * 0.6), // Example: 60% convert to subscriptions
    }));

    setUserSubscriptionData(userSubscriptionChartData);

    setCustomerTypes([
      { name: "Freebies", value: roleCount.free },
      { name: "Learners", value: roleCount.learners },
      { name: "Pro Users", value: roleCount.pro },
    ]);
  }

  // Process payments for Revenue & Sales Chart
  function processPaymentData(paymentData) {
    const monthlyRevenue = {};
    const monthlySales = {};

    paymentData.forEach(payment => {
      const createdMonth = new Date(payment.created_at).toLocaleString("en-US", { month: "short" });

      monthlyRevenue[createdMonth] = (monthlyRevenue[createdMonth] || 0) + payment.amount;
      monthlySales[createdMonth] = (monthlySales[createdMonth] || 0) + 1;
    });

    const revenueSalesChartData = Object.keys(monthlyRevenue).map(month => ({
      month,
      revenue: monthlyRevenue[month],
      sales: monthlySales[month],
    }));

    setRevenueSalesData(revenueSalesChartData);
  }

  return (
    <div className="adminDashboard-container">
      <div className="adminDashboard-header">
        <h2>Admin Dashboard</h2>
      </div>

      <div className='adminDashboard-charts-container'>
        {/* New Users & Subscriptions */}
        <div className="chart-container">
          <h2>New Users & Subscriptions</h2>
          <ComposedChart width={900} height={300} data={userSubscriptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newUsers" fill="#8884d8" barSize={30} />
            <Line type="monotone" dataKey="subscriptions" stroke="#FF7300" strokeWidth={2} />
          </ComposedChart>
        </div>

        <div className="adminDashboard-bottom-charts">
          {/* Monthly Revenue & Total Sales */}
          <div className="chart-container">
            <h2>Monthly Revenue & Total Sales</h2>
            <AreaChart width={500} height={300} data={revenueSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </div>

          {/* Customer Types */}
          <div className="chart-container">
            <h2>Customer Types</h2>
            <PieChart width={500} height={300}>
              <Pie data={customerTypes} cx="50%" cy="50%" outerRadius={100} label>
                {customerTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}




// import React from "react";
// import {
//   ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell
// } from "recharts";
// import "./AdminDashboard.css";
// import { getAllUsers, getPaymentHistory } from "../../../server/api";

// const userSubscriptionData = [
//   { month: "Jan", newUsers: 120, subscriptions: 80 },
//   { month: "Feb", newUsers: 200, subscriptions: 150 },
//   { month: "Mar", newUsers: 250, subscriptions: 180 },
//   { month: "Apr", newUsers: 300, subscriptions: 230 },
//   { month: "May", newUsers: 350, subscriptions: 290 },
//   { month: "Jun", newUsers: 390, subscriptions: 310 },
// ];

// const revenueSalesData = [
//   { month: "Jan", revenue: 500, sales: 120 },
//   { month: "Feb", revenue: 700, sales: 180 },
//   { month: "Mar", revenue: 850, sales: 200 },
//   { month: "Apr", revenue: 1100, sales: 250 },
//   { month: "May", revenue: 1300, sales: 320 },
//   { month: "Jun", revenue: 1500, sales: 370 },
// ];

// const customerTypes = [
//   { name: "Freebies", value: 150 },
//   { name: "Learners", value: 50 },
//   { name: "Pro Users", value: 20 },
// ];

// const COLORS = ["#00C49F", "#0088FE", "#FFBB28"];

// export default function AdminDashboard() {
//   return (
//     <div className="adminDashboard-container">
//       <div className="adminDashboard-header">
//         <h2>Admin Dashboard</h2>
//       </div>

//       <div className='adminDashboard-charts-container'>
//         {/* ComposedChart - New Users (Bar) & Subscriptions (Line) */}
//         <div className="chart-container">
//           <h2>New Users & Subscriptions</h2>
//           <ComposedChart width={900} height={300} data={userSubscriptionData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="newUsers" fill="#8884d8" barSize={30} />
//             <Line type="monotone" dataKey="subscriptions" stroke="#FF7300" strokeWidth={2} />
//           </ComposedChart>
//         </div>

//         <div className="adminDashboard-bottom-charts">
//           {/* AreaChart - Monthly Revenue & Total Sales */}
//           <div className="chart-container">
//             <h2>Monthly Revenue & Total Sales</h2>
//             <AreaChart width={500} height={300} data={revenueSalesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" />
//               <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
//             </AreaChart>
//           </div>

//           {/* PieChart - Customer Types */}
//           <div className="chart-container">
//             <h2>Customer Types</h2>
//             <PieChart width={500} height={300}>
//               <Pie data={customerTypes} cx="50%" cy="50%" outerRadius={100} label>
//                 {customerTypes.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
