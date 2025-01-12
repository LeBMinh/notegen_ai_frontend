import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './font.css'
// import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import MainPage from './components/pages/MainPage/MainPage';
import SignUp from './components/pages/SignUp/SignUp';
import SignIn from './components/pages/SignIn/SignIn'

const pageVariants = {
  initial: { opacity: 0, x: "100vw" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "-100vw" },
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Track user information
  const [isSigningUp, setIsSigningUp] = useState(true); // Toggle between SignUp and SignIn

  return (
    // <div style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
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
            {/* <Routes>
              <Route path="/*" element={<MainPage />} />
            </Routes> */}
            <MainPage setAuthenticated={setAuthenticated} user={user}/>
          </motion.div>
        )}
      </AnimatePresence>
      </Router>
  )
}

export default App
