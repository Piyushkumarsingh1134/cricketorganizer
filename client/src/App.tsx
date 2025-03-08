import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import OrganizerRegistration from './pages/organizerregistration'
import { Organizerlogin } from './pages/organizerlogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div> 
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/register/organizer" element={<OrganizerRegistration />} />
          <Route path="/Organizerlogin"     element={<Organizerlogin/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

