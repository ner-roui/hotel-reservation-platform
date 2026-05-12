import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './pages/login'
import Dashboard from './pages/Dashboard'
import CreateRoomPage from './pages/AddChambre'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout'
import ChambresAdmin from './pages/ListRoom'
import Home from './pages/Home'
function App() {
  return (
    <>
    <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/home' element={<Home/>}/>
      <Route path='/' element={<Layout/>} >
        <Route path='Dashboard' element={<Dashboard/>} />
        <Route path='Createroom' element={<CreateRoomPage/>} />
        <Route path='edit-room/:id' element={<CreateRoomPage/>} />
        <Route path='Listroom' element={<ChambresAdmin/>} />
      
       
      </Route>
    
    </Routes>
    {/* <LoginPage/> */}
    {/* <Dashboard/> */}

    {/* <CreateRoomPage/> */}
    </>
  )
}

export default App