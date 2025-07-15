// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import OrganizerRegistration from './pages/organizerregistration';
import { OrganizerLogin } from './pages/organizerlogin';
import RegisterTeam from './pages/Teamregistraion';
import LoginTeam from './pages/Loginteam';
import Tournament from './components/Tournamnet';
import { ScheduleTournament } from './components/sechduletournament';
import TeamsList from './components/Team';
import OrganizerDashboard from './components/Organizerdashboard';
import OrganizerLayout from './components/Organizerlayout';
import CricketScorer from './pages/Match';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/register/organizer" element={<OrganizerRegistration />} />
        <Route path="/Organizerlogin" element={<OrganizerLogin />} />
        <Route path="/RegisterTeam" element={<RegisterTeam />} />
        <Route path="/LoginTeam" element={<LoginTeam />} />
        <Route path="/Tournament" element={<Tournament />} />
        <Route path="/CricketScorer" element={<CricketScorer/>}/>

        {/* Organizer Routes with Persistent Sidebar */}
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<OrganizerDashboard />} />
          <Route path="schedule" element={<ScheduleTournament />} />
          <Route path="teams" element={<TeamsList />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


