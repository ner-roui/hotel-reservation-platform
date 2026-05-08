import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './pages/login'
import Dashboard from './pages/Dashboard'
import CreateRoomPage from './pages/AddChambre'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <>
    {/* <LoginPage/> */}
    {/* <Dashboard/> */}
    {/* <Sidebar/> */}
    <CreateRoomPage/>
    </>
  )
}

export default App