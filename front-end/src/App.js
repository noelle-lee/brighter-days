import './App.css';
import Navigation from './components/Navigation';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import JournalPage from './pages/JournalPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './authorization/ProtectedRoutes';
import { io } from 'socket.io-client';
import DailyTips from './pages/DailyTips';

function App() {
  const [background, setBackground] = useState(null);
  
    
  // Fetch background data from the microservice
  useEffect(() => {
      const socket = io('http://localhost:9814');

      // Listen for background updates
      socket.on('background-update', (data) => {
        console.log('Background update received: ', data);
        setBackground(data.imagePath);
      });

      return () => {
        socket.disconnect();
      };
  }, []);
  
  // Apply dynamic background
  const backgroundStyle = background
      ? {
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            width: '100%',
        }
      : {};
 
  return (
    <div className="App" style={backgroundStyle}>
      <div className="App-home">
        <Router>
            <Navigation /> 
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/mood-tracker" element={<ProtectedRoute><MoodTrackerPage /></ProtectedRoute>} />
                <Route path="/journal-log" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
                <Route path="/daily-tips" element={<ProtectedRoute><DailyTips /></ProtectedRoute>} />
            </Routes>
        </Router>
        <footer className="App-footer">
          © 2024 Noelle Lee
        </footer>
      </div>
    </div>
  );

}

export default App;