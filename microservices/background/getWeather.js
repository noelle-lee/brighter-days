import express from 'express';
import 'dotenv/config';
import path from 'path';
import { promises as fs, watch } from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:8001',
        methods: ['GET', 'POST'],
    }
});


// Allow Requests from localhost:8001 (Noelle's React webapp)
app.use(cors({
    origin: 'http://localhost:8001'
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(path.resolve(), 'images');
app.use(express.static(imageDir));
const configBackground = path.join(path.resolve(), 'weather.txt');

const weatherToImage = {
    'clear sky': '/clear_sky.jpg',
    'few clouds': '/few_clouds.jpg',
    'broken clouds': '/broken_clouds.jpg',
    'scattered clouds': '/scattered_clouds.jpg',
    'mist': '/mist.jpg',
    'shower rain': '/shower_rain.jpg',
    'rain': '/rain.jpg',
    'snow': '/snow.jpg',
    'thunderstorm': '/thunderstorm.jpg',
    'overcast clouds': '/overcast_clouds.jpg',
    'default': '/default.jpg'
};

app.post('/save-weather', (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ error: 'Weather description is required' });
    }

    const filePath = path.join(__dirname, 'weather.txt');
    fs.writeFile(filePath, description, 'utf-8', (err) => {
        if (err) {
            console.error('Error writing to file: ', err);
            return res.status(500).json({ error: 'Failed to save weather description' });
        }
        res.status(200).json({ message: 'Weather description saved successfully' });
    })
});

app.get('/', (req, res) => {
    res.send('Socket.IO server is running successfully');
})

app.get('/background', async (req, res) => {
    try {
        const configWeatherBackground = await fs.readFile(configBackground, 'utf-8');
        const weatherCondition = configWeatherBackground.trim();
        const imagePath = weatherToImage[weatherCondition] || weatherToImage['default'];

        const backgroundData = {
            color: '#f0f8ff', // Light blue
            imagePath: `http://localhost:9814${imagePath}`,
            altText: weatherCondition || 'Default Background'
        };
        res.json(backgroundData);
    } catch (error) {
        console.error('Error reading the weather description file, using default background: ', error);
        res.status(500).json({ color: '#f0f8ff', imagePath: weatherToImage['default'], altText: 'defaultBackground' });
    }

});

// Get real-time updates from WebSocket
io.on('connection', (socket) => {
    // Watch for changes to the background config file
    const watcher = watch(configBackground, async() => {
        try {
            const configWeatherBackground = await fs.readFile(configBackground, 'utf-8');
            const weatherCondition = configWeatherBackground.trim();
            const imagePath = weatherToImage[weatherCondition] || weatherToImage['default'];

            const backgroundData = {
                color: '#f0f8ff', // Light blue
                imagePath: `http://localhost:9814${imagePath}`,
                altText: weatherCondition || 'Default Background'
            };
    
            socket.emit('background-update', backgroundData);
            console.log("Background image sent successfully!")
        } catch (error) {
            console.error('Error reading the weather description file, using default background: ', error);
            socket.emit('background-update', { color: '#f0f8ff', imagePath: weatherToImage['default'], altText: 'defaultBackground' });
        }
    });

    socket.on('disconnect', () => {
        watcher.close();
    });
}) 

// Start the microservice
httpServer.listen(PORT, () => {
    console.log(`Dynamic Background Microservice running on localhost:${PORT}`);
});