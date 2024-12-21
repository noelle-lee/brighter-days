import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { MdInfo } from 'react-icons/md';

export const MoodTrackerPage = ({ moodTracker }) => {
  const [moods, setMoods] = useState({});
  const [selectedDate, setDate] = useState(new Date());
  const [mood, setMood] = useState('');
  const [existingMood, setExistingMood] = useState(null);

  const moodOptions = ["happy", "sad", "excited", "calm", "anxious"]; // Dropdown options

  useEffect(() => {
    // Fetch all moods from backend on component mount
    const fetchMoods = async () => {
      const response = await fetch('http://localhost:5813/mood-tracker');
      const data = await response.json();
      const moodsData = {};
      data.forEach((entry) => {
        moodsData[entry.date] = entry.mood;
      });
      setMoods(moodsData);
    };

    fetchMoods();
  }, []);

  const fetchMoodForDate = async (date) => {
    const formatDate = date.toISOString().split('T')[0];
    const response = await fetch(`http://localhost:5813/mood-tracker/date/${formatDate}`);
    if (response.ok) {
        const data = await response.json();
        setExistingMood(data.mood); // Set the mood for the selected date
    } else {
        setExistingMood(null); // Clear if no mood data found
    }
};

  const handleSetMood = async (e) => {
    e.preventDefault();
    if (!selectedDate || !mood) {
      alert("Please select a date and a mood.");
      return;
    }

    const response = await fetch('http://localhost:5813/mood-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate.toISOString().split('T')[0], mood }),
    });

    const data = await response.json();
    setMoods((prevMoods) => ({
        ...prevMoods,
        [selectedDate.toISOString().split('T')[0]]: data.mood,
    }));
    setExistingMood(data.mood);
    alert('Successfully saved the mood');
    setMood('');
  };

  const updateMood = async(e) => {
    e.preventDefault();
    if (!selectedDate || !mood) {
      alert("Please select a date and a mood.");
      return;
    }

    const formatDate = selectedDate.toISOString().split('T')[0]
    const response = await fetch(`http://localhost:5813/mood-tracker/date/${formatDate}`, {
        method: 'PUT', 
        body: JSON.stringify({ mood, date: selectedDate.toISOString().split('T')[0] }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (response.ok) {
      const updatedMood = await response.json(); // Get the updated mood data
      setMoods((prevMoods) => ({
        ...prevMoods,
        [formatDate]: updatedMood.mood, // Update the mood state
      }));
      setExistingMood(updatedMood.mood); // Update the existing mood state
      alert('Successfully edited the mood');
    } else {
      alert(`Failed to edit mood, status code = ${response.status}`);
    }
  }

  const deleteMood = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    const formatDate = selectedDate.toISOString().split('T')[0];
    const response = await fetch(`http://localhost:5813/mood-tracker/date/${formatDate}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        setMoods((prevMoods) => {
            const newMoods = { ...prevMoods };
            delete newMoods[formatDate]; // Remove the mood from local state
            return newMoods;
        });
        setExistingMood(null); // Clear existing mood state
        alert('Mood deleted successfully');
    } else {
        alert(`Failed to delete mood, status code = ${response.status}`);
    }
  };

  const handleDateChange = (date) => {
    setDate(date); // Set selected date
    fetchMoodForDate(date); // Fetch mood for the newly selected date
  };


  const [isHover, setisHover] = useState(false);

  const handleOnMouseOver = () => {
    setisHover(true);
  };

  const handleMouseout = () => {
    setisHover(false);
  };

  return (

    
    <div className="Create-mood">
        <h1>
          Add Mood 
          <MdInfo onMouseOver={handleOnMouseOver} onMouseOut={handleMouseout}>
            Hover on me
          </MdInfo>
        </h1>



        {isHover && (
          <>
            <div>Set your daily mood using the dropdown menu. Each mood that is set will display a color on the specific date you choose.</div>
          </>
        )}

        <div className="Mood-calendar">
            
            <Calendar 
                value={selectedDate} 
                onChange={handleDateChange} 
                tileClassName={({ date }) => {
                    const dateKey = date.toISOString().split('T')[0];
                    return moods[dateKey]; // Set the class based on mood
                }}
            />
        </div>
        <h3>Mood for {selectedDate.toLocaleDateString()}</h3>

      {/* Display existing mood for the selected date */}
      {selectedDate && (
        <div>
          {existingMood ? (
            <p>Current Mood: {existingMood}</p>
          ) : (
            <form id="Mood-selection" onSubmit={handleSetMood}>
              <label>Select Mood: <select id="mood-dropdown" value={mood} onChange={(e) => setMood(e.target.value)}>
                  <option value="">-Select a mood-</option>
                  {moodOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <div id="Mood-submissions">
                <button className="crud-buttons" id="submit" type="submit">Save</button>
                <button className="crud-buttons" id="update" onClick={updateMood}>Update</button>
                <button className="crud-buttons" id="delete" onClick={deleteMood}>Delete Mood</button>
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );
};

export default MoodTrackerPage;
