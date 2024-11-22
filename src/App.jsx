import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './font.css'
import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/libs/Sidebar/Sidebar';
import ThemeSwitch from './components/libs/ThemeSwitch/ThemeSwitch';
import Dashboard from './components/pages/Dashboard/Dashboard';
import SignUp from './components/pages/SignUp/SignUp';

function App() {

  return (
    <div style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
      <Sidebar />
      {/* <div style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div> */}
    </div>
  )
}

export default App
