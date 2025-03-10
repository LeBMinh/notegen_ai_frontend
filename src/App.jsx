import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './font.css'
// import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { privateRoutes, adminRoutes } from './router/routerConfig'
import SignUp from './components/pages/SignUp/SignUp';
import SignIn from './components/pages/SignIn/SignIn';
import StartPage from './components/pages/StartPage/StartPage';
import MainPage from './components/pages/MainPage/MainPage';
import Information from './components/pages/Information/Information'
import AdminPage from './components/pages/AdminPage/AdminPage';

const pageVariants = {
  initial: { opacity: 0, x: "100vw" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "-100vw" },
};

function App() {
  const mutedWarnings = ['DOMNodeInserted'];
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (!mutedWarnings.some((warning) => args[0]?.includes(warning))) {
      originalConsoleWarn(...args);
    }
  };

  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Track user information
  const [isSigningUp, setIsSigningUp] = useState(false); // Toggle between SignUp and SignIn  // Start with Sign In

  // Check for existing session on load
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null); // Prevent app crash
      }
    }
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {!authenticated ? (
          isSigningUp ? (
            <motion.div
              key="signup"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <SignUp
                setAuthenticated={setAuthenticated}
                setUser={setUser}
                toggleSignIn={() => setIsSigningUp(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signin"
              variants={{
                initial: { opacity: 0, x: "100vw" },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: "100vw" },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <SignIn
                setAuthenticated={setAuthenticated}
                setUser={setUser}
                toggleSignUp={() => setIsSigningUp(true)}
              />
            </motion.div>
          )
        ) : (
          <motion.div
            key="main"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <Routes>
              {/* StartPage is the bridge before redirecting */}
              <Route
                path="/"
                element={<StartPage setAuthenticated={setAuthenticated} />}
              />

              {/* Main Dashboard */}
              <Route element={<MainPage user={user} setAuthenticated={setAuthenticated} />}>
                <Route path="information" element={<Information user={user} />} />
                {privateRoutes.map(route => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* Admin Dashboard */}
              {/* <Route element={
                user?.isAdmin ? <AdminPage setAuthenticated={setAuthenticated} /> : <Navigate to="/" />
              }> */}
              <Route element={ <AdminPage user={user.isAdmin} setAuthenticated={setAuthenticated} /> 
              }>
                {adminRoutes.map(route => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  )
}

export default App
