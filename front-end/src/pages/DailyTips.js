import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import '../App.css';

export const DailyTips = () => {

  const [tips, setTip] = useState([]);
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const fetchTip = async() => {
      try {
        
        const response = await fetch('http://localhost:7194/daily-tip');
        
        if (!response.ok) {
          throw new Error('Failed to fetch daily tip.');
        } 
        const data = await response.json();
        setTip(data.tip);
        setResource(data.resource);
        
      } catch (error) {
        console.error('Error fetching daily tip: ', error);
        setTip('Failed to fetch a daily tip.');
      }
    };
    fetchTip();

  }, []);


  return (
    <div className="Journal-page">
        <h1>Daily Tips</h1>
        <h2>What is seasonal depression?</h2>
        <p id="daily-tip-description">Seasonal depression, also known as seasonal affective disorder (SAD), 
            is a type of depression that occurs at specific times of the year, 
            typically during the fall and winter months. 
            It is believed to be related to changes in light exposure as the days grow shorter. 
            While less common, some people may also experience SAD during the spring and summer months.</p>
        <h2>Tip of the day:</h2>
        <div id="tips-description">{tips}</div>
        <a href={resource} id="tips-description">{resource}</a>


    </div>
  );
};

export default DailyTips;