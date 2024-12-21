import React from 'react';
import FetchLocation from '../components/FetchLocation';

function HomePage({ homePage }) {



    return (
        <div className="HomePage-home">
            <header className="HomePage-header">
                <div className="HomePage-title">
                <h1>Brighter Days</h1>
                <h2>A weather wellness app to help you through winter and beyond. Learn ways to feel better on dark days and track your progress!</h2>
                <p>The home page will display the current weather conditions based on your location. You can log in your daily mood in the mood tracker and write your thoughts in the journal log.</p>
                </div>
                <FetchLocation />
            </header>
        </div>
    );

};

export default HomePage;