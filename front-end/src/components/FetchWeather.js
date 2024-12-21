const fetchWeather = async (lat, lon) => {
    const apiKey = ''; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        return data; // Contains weather data, including temperature, humidity, etc.
        } catch (error) {
        console.error("Error fetching weather data:", error);
        }
};

export default fetchWeather;