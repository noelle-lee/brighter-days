import React, { useState, useEffect } from 'react';
import fetchWeather from './FetchWeather';

const FetchLocation = () => {

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const saveWeather = async (description) => {
    try {
        const response = await fetch ('http://localhost:9814/save-weather' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            throw new Error('Failed to save weather');
        }
        console.log('Saved weather description successfully!');
    } catch (err) {
        console.error('Error saving weather: ', err);
    }
  };
    
  // Automatically request user location on mount
  useEffect(() => {
      const getLocationAndWeather = async () => {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
              async (position) => {
                  const { latitude, longitude } = position.coords;
                  const data = await fetchWeather(latitude, longitude);
                  if (data) {
                    setWeather(data);
                    saveWeather(data.weather[0].description);
                  }
                  else 
                      setError("Could not retrieve weather for your location.");
              },
              (err) => {
                  setError("Location permission denied. Unable to fetch weather.");
              }
              );
          } else {
              setError("Geolocation is not supported by your browser.");
          }
      };
  
      getLocationAndWeather();

  }, []); 

  return (
            <header className="FetchLocation-header">
              {
                  weather ? (
                      <div className="Weather-display">
                          <h2>{weather.name}</h2>
                          <p>Condition: {weather.weather[0].description}</p>
                          <span>Temperature: {weather.main.temp}°F </span>
                          <br></br>
                          <span>Humidity: {weather.main.humidity}%</span>
                      </div>
                  ):(
                      !error && <p>Requesting location access...</p>
                  )
              }
            </header>
    );
};

export default FetchLocation;