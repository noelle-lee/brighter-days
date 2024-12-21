import express from 'express';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';

const PORT = process.env.PORT;
const app = express();

// Allow Requests from localhost:8001 (Noelle's React webapp)
app.use(cors({
    origin: 'http://localhost:8001'
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tipsDir = path.join(path.resolve(), 'tips');

function getFileByMonth() {
    const month = new Date().getMonth(); // Get the current month (0-based: 0=January, 11=December)
    let fileName;

    if (month === 0 || month === 1) {
      fileName = '1_tip.txt'; // January, February
    } else if (month === 2 || month === 3) {
      fileName = '2_tip.txt'; // March, April
    } else if (month === 4 || month === 5) {
      fileName = '3_tip.txt'; // May, June
    } else if (month === 6 || month === 7) {
      fileName = '4_tip.txt'; // July, August
    } else if (month === 8 || month === 9) {
      fileName = '5_tip.txt'; // September, October
    } else if (month === 10 || month === 11) {
      fileName = '6_tip.txt'; // November, December
    }

    return fileName;
  }

const fileName = getFileByMonth();

app.use(express.static(tipsDir));
const selectedTip = path.join(tipsDir, fileName);

const getTip = () => {
    const data = fs.readFileSync(selectedTip, 'utf-8');
    return data;
};

// Endpoint to fetch a tip
app.get('/daily-tip', (req, res) => {
    try {
        const tips = getTip();
        if (tips.length === 0) {
            return res.status(404).send('No tips found.');
        }

        const lines = tips.split('\n');
        res.json({ tip: lines[0].trim(), resource: lines[1].trim() });
        console.log("Tip and source sent successfully!");
    } catch (error) {
        console.error('Error fetching tip:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the microservice
app.listen(PORT, () => {
    console.log(`Daily Tip Microservice running on localhost:${PORT}`);
});