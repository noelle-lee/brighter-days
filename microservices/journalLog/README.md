# Microservice A

This microservice provides a backend for managing mood journal entries. Users can create, retrieve, update, and delete journal entries with their current mood and thoughts. All data is stored in a MongoDB database and are accessible via RESTful API endpoints. 

## Setup 

### Install Dependencies
Navigate to the project directory and install the required dependencies using `npm`:
```bash
npm install
```

### Configure Environment

Update the .env file in the root directory with your MongoDB credentials and PORT value (defaulted to 3002) 
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
PORT=3002
```
### Start Server 

Run the following command to start the server:

```bash
node app.js
```
or if running Nodemon: 

```bash
nodemon app.js
```


## Communication Contract

### 1. Create a New Entry

**Endpoint**: http://localhost:3002/entries

**Method**: POST

**Body** (example):
```bash 
{
  "mood": "Happy",
  "thoughts": "Feeling great today!"
}
```

**Status Codes**:
- 201 Created: The entry was successfully created.
- 500 Internal Server Error: The server encountered an error while creating the entry.

**Request**: Sends a JSON object containing mood and thoughts to create a new entry.

**Response**:

```bash
{
  "_id": "64fcd30ad5932c1a64d0fa5b",
  "mood": "Happy",
  "thoughts": "Feeling great today!",
  "date": "2024-11-15T12:00:00.000Z"
}
```
**Example Call**:
```bash
const response = await fetch("http://localhost:3002/entries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mood: "Happy",
    thoughts: "Feeling great today!"
  })
});
console.log(await response.json());
```

### 2. Retrieve All Entries

**Endpoint**: http://localhost:3002/entries

**Method**: GET

**Status Codes**:
- 200 OK: All entries were successfully retrieved.
- 500 Internal Server Error: The server encountered an error while fetching the entries.

**Request**: Sends a GET request to retrieve all journal entries.

**Response**:

```bash
[
  {
    "_id": "64fcd30ad5932c1a64d0fa5b",
    "mood": "Happy",
    "thoughts": "Feeling great today!",
    "date": "2024-11-15T12:00:00.000Z"
  }
]
```

**Example Call**:
```bash
const response = await fetch("http://localhost:3002/entries", {
  method: "GET"
});
console.log(await response.json());
```

### 3. Retrieve an Entry by ID
**Endpoint**: http://localhost:3002/entries/:id

**Method**: GET

**Status Codes**:
- 200 OK: The entry was successfully retrieved.
- 404 Not Found: No entry exists with the provided ID.
- 500 Internal Server Error: The server encountered an error while retrieving the entry.

**Request**: Replace ":id" with the ID of the entry to retrieve.

**Response**:

```bash
{
  "_id": "64fcd30ad5932c1a64d0fa5b",
  "mood": "Happy",
  "thoughts": "Feeling great today!",
  "date": "2024-11-15T12:00:00.000Z"
}
```

**Example Call**: 
```bash
const response = await fetch("http://localhost:3002/entries/64fcd30ad5932c1a64d0fa5b", {
  method: "GET"
});
console.log(await response.json());
```

### Update Entry by ID

**Endpoint**: http://localhost:3002/entries/:id

**Method**: PUT

**Status Codes**:
- 200 OK: The entry was successfully updated.
- 404 Not Found: No entry exists with the provided ID.
- 500 Internal Server Error: The server encountered an error while updating the entry.

**Request**: Replace ":id" with the ID of the entry to update. Send the updated mood and thoughts in the body.

**Response**:

```bash
{
  "_id": "64fcd30ad5932c1a64d0fa5b",
  "mood": "Excited",
  "thoughts": "What a fantastic day!",
  "date": "2024-11-15T12:00:00.000Z"
}
```

**Example Call**: 
```bash
const response = await fetch("http://localhost:3002/entries/64fcd30ad5932c1a64d0fa5b", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mood: "Excited",
    thoughts: "What a fantastic day!"
  })
});
console.log(await response.json());
```

### Delete an Entry by ID

**Endpoint**: http://localhost:3002/entries/:id

**Method**: DELETE

**Status Codes**:
- 200 OK: The entry was successfully deleted.
- 404 Not Found: No entry exists with the provided ID.
- 500 Internal Server Error: The server encountered an error while deleting the entry.

**Request**: Replace ":id" with the ID of the entry to delete.

**Response**: 
```bash
{
  "message": "Entry deleted successfully"
}
```

**Example Call**: 
```bash
const response = await fetch("http://localhost:3002/entries/64fcd30ad5932c1a64d0fa5b", {
  method: "DELETE"
});
console.log(await response.json());
```

## UML Diagrams
### Create New Entry
<img width="541" alt="Screen Shot 2024-11-17 at 5 56 16 PM" src="https://github.com/user-attachments/assets/fd3a8692-b85e-4eb2-9c2b-111714d133d0">

### Retrieve All Entries
<img width="551" alt="Screen Shot 2024-11-17 at 5 57 46 PM" src="https://github.com/user-attachments/assets/e9a1dfcb-16e1-4cc4-b617-433cb6a643ad">

### Update Entry by ID
<img width="514" alt="Screen Shot 2024-11-17 at 5 59 15 PM" src="https://github.com/user-attachments/assets/f36c4237-3f1c-47bc-943b-ce45f886f6fe">

### Delete Entry by ID
<img width="514" alt="Screen Shot 2024-11-17 at 6 00 16 PM" src="https://github.com/user-attachments/assets/0fe4e9b7-76b6-42ee-999b-0a58a87a01e9">



