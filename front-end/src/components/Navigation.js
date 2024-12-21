import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Navigation() {
    const navigate = useNavigate();

    
    const clearWeather = async(description) => {
        try {
            const response = await fetch ('http://localhost:9814/save-weather' , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({ description }),
            });
    
            console.log(response);
            if (response.ok) {
                console.log('Successfully removed contents of weather.txt');
            } else {
                console.error('Failed to remove contents of weather.txt');
            }

        } catch (error) {
            console.error('Error clearing weather data: ', error)
        }
    }
    

    const handleLogout = async() => {
        clearWeather('default');

        // Remove JWT to logout 
        localStorage.removeItem('token');

        // Redirect to login page
        navigate("/"); 
    }

    return (
        <nav className="App-nav">
            <button id="logout-button" onClick={handleLogout}>
                Logout
            </button>
            <Link to="/home" id="nav-buttons">Home </Link>
            <Link to="/mood-tracker" id="nav-buttons">Mood Tracker </Link>
            <Link to="/journal-log" id="nav-buttons">Journal Log </Link>
            <Link to="/daily-tips" id="nav-buttons">Daily Tips </Link>
        </nav>
    );
}

export default Navigation;