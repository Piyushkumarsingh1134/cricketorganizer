import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import OrganizerRegistration from './pages/organizerregistration'
import { OrganizerLogin } from './pages/organizerlogin'
import Organizerdashboard from './components/Organizerdashboard'
import BackgroundShapeDemo from './pages/Test'
import OrganizerDashboard from './components/Organizerdashboard'
import RegisterTeam from './pages/Teamregistraion'
import LoginTeam from './pages/Loginteam'
import Tournament from './components/Tournamnet'
import { ScheduleTournament } from './components/sechduletournament'
import TeamsList from './components/Team'

function App() {
 

  return (
    <>
    <BrowserRouter>
     {
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/register/organizer" element={<OrganizerRegistration />} />
          <Route path="/Organizerlogin"     element={<OrganizerLogin/>}/>
          <Route path="/Organizerdashboard"  element={<Organizerdashboard/>}/>
          <Route path="/RegisterTeam"        element={<RegisterTeam/>}/>
          <Route path="/LoginTeam"        element={<LoginTeam/>}/>
          <Route path="/Tournament"        element={<Tournament/>}/>
          <Route path='/ScheduleTournament' element={ <ScheduleTournament/>}/>
          <Route path='/TeamsList' element={ <TeamsList/>}/>
        </Routes> }
      
    </BrowserRouter>
  
 
    </>
  )
}

export default App

