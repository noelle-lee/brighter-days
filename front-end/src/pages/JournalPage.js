import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import '../App.css';
import { MdInfo } from 'react-icons/md';

export const JournalPage = () => {

    /*
    This section calls on the Journal Log microservice A (written by Jenny Wang).
    */

    const [entries, setEntries] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentMood, setCurrentMood] = useState('');
    const [currentThoughts, setCurrentThoughts] = useState('');
    const [selectedEntry, setSelectedEntry] = useState(null);

    const moodOptions = ["happy", "sad", "excited", "calm", "anxious"]; // Dropdown options

    // Fetch existing entries
    useEffect(() => {
      fetch('http://localhost:3002/entries')
          .then((response) => response.json())
          .then((data) => setEntries(data));
    }, []);
      
    const handleDateChange = function (date) {
      setCurrentDate(date);
    }

    const handleMoodChange = function(e) {
      setCurrentMood(e.target.value);
    }

    const handleTextChange = function(e) {
      setCurrentThoughts(e.target.value);
    }

    const handleAddEntry = async (e) => {
      e.preventDefault();
      if (!currentDate || !currentMood || !currentThoughts) {
        alert('Please fill out all fields.');
        return;
      }

      try {
        const response = await fetch("http://localhost:3002/entries" , {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: currentMood,
            thoughts: currentThoughts,
            date: currentDate
          })
        });
        const data = await response.json();
        if (response.ok) {
          setEntries([...entries, data]);
          setCurrentMood(data.mood);
          setCurrentThoughts(data.thoughts);
          setCurrentDate(data.date);
          alert("Journal entry saved successfully!");
        } else {
          alert(`Error: ${data.message}`);
        }

      } catch (error) {
        console.error('Error: ', error);
      }

    }

    const handleUpdateEntry = async (e) => {
      e.preventDefault();
      if (!selectedEntry) {
        alert("Please select an entry to update.");
        return;
      }

      try {
        const response = await fetch (`http://localhost:3002/entries/${selectedEntry._id}` , {
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: currentMood || selectedEntry.mood,
            thoughts: currentThoughts || selectedEntry.thoughts,
            date: currentDate || selectedEntry.date
          })
        });
        const updatedEntry = await response.json();
        if (response.ok) {
          setEntries(
            entries.map((entry) => entry._id === updatedEntry._id ? updatedEntry: entry)
          );
          alert('Entry succesfully updated!');
          setSelectedEntry(updatedEntry);
        } else {
          alert(`Error: ${updatedEntry.message}`);
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    const handleSelectChange = (e) => {
      const selectedId = e.target.value;
      const entry = entries.find((entry) => entry._id === selectedId);
      setSelectedEntry(entry);

      // Populate fields with saved data
      if (entry) {
        setCurrentMood(entry.mood);
        setCurrentThoughts(entry.thoughts);
        setCurrentDate(entry.date);
      }
    };

    const handleDeleteEntry = async () => {
      const confirmationWindow = window.confirm(
        "Do you want to delete this entry? You will not be able to recover this entry."
      );

      if (confirmationWindow) {
        try {
          const response = await fetch(`http://localhost:3002/entries/${selectedEntry._id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            alert("Journal entry deleted successfully!");
            setEntries(entries.filter(entry => entry._id !== selectedEntry._id));
            setSelectedEntry(null);
          } else {
            const data = await response.json();
            alert(`Failed to delete entry, error: ${data.error}`);
          }
        } catch (error) {
          console.error("Error deleting entry: ", error);
          alert("An error occurred while deleting this entry.");
          
        }
      } 


    }
    const [isHover, setisHover] = useState(false);

    const handleOnMouseOver = () => {
      setisHover(true);
    };

    const handleMouseout = () => {
      setisHover(false);
    };

    /*
    This section calls on the Journal Prompt microservice B.
    */
    const [prompt, setPrompt] = useState('');

    const fetchPrompt = async() => {
      try {
        
        const response = await fetch('http://localhost:6826/journal-prompt');
        
        if (!response.ok) {
          throw new Error('Failed to fetch journal prompt.');
        } 
        const data = await response.json();
        setPrompt(data.prompt);
        
      } catch (error) {
        console.error('Error fetching journal prompt: ', error);
        setPrompt('Failed to fetch a journal prompt.');
      }
    };

  return (

    
    <div className="Journal-page">
        <h1>
          Daily Journal Log
          <MdInfo onMouseOver={handleOnMouseOver} onMouseOut={handleMouseout}>
            Hover on me
          </MdInfo>
        </h1>

        {isHover && (
          <>
            <div>Write down your daily thoughts in the journal log. You can also set your daily mood here.</div>
          </>
        )}

      <div className="Journal-page-options">

        <div style={{ fontFamily: 'Arial, sans-serif' }} className="Retrieve-entries">
          <label> Select an Entry: </label>
              {/* Dropdown menu with entries */}
              <select onChange={handleSelectChange} style={{ padding: '5px', marginBottom: '20px' }}>
                  <option value="">-- Select an Entry --</option>
                  {entries.map((entry) => (
                      <option key={entry._id} value={entry._id}>
                          {new Date(entry.date).toLocaleDateString()}
                      </option>
                  ))}
              </select>
          </div>

        <div className="Add-date">
          <label>Select a Date: </label>
          <DatePicker showIcon selected={currentDate} onChange={handleDateChange} />
        </div>
        

        {/* Display existing mood for the selected date */}
        <div className="Add-mood">
            <label>Select Mood: </label>
              <select value={currentMood} onChange={handleMoodChange} style={{ padding: '5px', marginBottom: '20px' }}>
                <option value="">-Select a mood-</option>
                {moodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            
        </div>

        <div className="Journal-prompt">
              <button id="prompt-button" onClick={fetchPrompt}>
                  Journal Prompt
              </button>
              {prompt && (
                  <div>
                      <p style={{ fontSize: '18px', color: 'black' }}>{prompt}</p>
                  </div>
              )}
          </div>
        </div>

        <div className="Add-thoughts">
          <label className="Journal-entry">
          <br/>
            Journal log: 
            <br/>
            <textarea
                rows = {12}    
                cols = {100}    
                placeholder = "Add your text"   
                wrap = "soft"  
                name = "name"  
                value={currentThoughts}
                onChange={handleTextChange}
            />
            </label>
        </div>

        <div className="Add-entry">
          <form onSubmit={handleAddEntry}>
            <button className="crud-buttons" id="submit" type="button" onClick={handleAddEntry}>Save</button>
            <button className="crud-buttons" id="update" type="button" onClick={handleUpdateEntry}>Update</button>
            <button className="crud-buttons" id="delete" type="button" onClick={handleDeleteEntry}>Delete</button>
          </form>
        </div>
    </div>
  );
};

export default JournalPage;