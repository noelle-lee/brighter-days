# Brighter Days
Brighter Days is a wellness-based web application focused on helping users manage symptoms of seasonal affective disorder (SAD). Brighter Days aims to help users track their mood as it correlates to the current weather conditions and develop skills on how to improve their mental wellness. The web application was built as a microservice architecture, made up of 6 different microservices:
1. User Authentication
2. Get Background
3. Mood Tracker
4. Journal Log
5. Journal Prompt
6. Daily Tips

# Project Preview
## Login / Register
Utilizes the **User Authentication** microservice to perform the following:
- Allow users to register for a new account
- Allow users to log in using a valid username and password
- Allow users to access protected pages using a valid JSON Web Token

![image](https://github.com/user-attachments/assets/94d895db-7eff-44c0-84e1-4c9389422514)
![image](https://github.com/user-attachments/assets/d1954d5f-d37e-4e1c-b01b-48ca932a154f)

## Home Page
Requests the user's geolocation in order to display the user's current weather condition using [OpenWeather's API](https://openweathermap.org/).<br/>
Utilizes the **Get Background** microservice to render the web app's background that corresponds to the weather conditions of the user.

![image](https://github.com/user-attachments/assets/8499419e-00da-48dd-a045-d53e8e3bc8e3)

## Mood Tracker
Utilizes the **Mood Tracker** microservice to perform the following: 
- Allow users to perform CRUD operations of a mood for a specific date
- Each mood is color coded (happy: yellow, sad: blue, excited: orange, calm: green, anxious: red)

![image](https://github.com/user-attachments/assets/acde5587-aa9b-4245-a705-52650173e16c)

## Journal Log
Utilizes the **Journal Log** microservice to perform CRUD operations on a mood and journal entry for a specific date. 
Utilizes the **Journal Prompt** microservice to generate a random journal prompt at a click of a button. 

![image](https://github.com/user-attachments/assets/47c99499-a576-48af-b98f-17efc3c48ceb)

## Daily Tips
Utilizes the **Daily Tips** microservice that generates a new tip daily on how to manage symptoms of SAD. 

![image](https://github.com/user-attachments/assets/a5b32c7f-26da-403d-a49c-3d9a96bbb290)
