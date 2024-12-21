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

// File paths
const promptsFilePath = path.join(__dirname, 'prompts.txt');
const selectedPromptFilePath = path.join(__dirname, 'selectedPrompt.txt');

// Utility to read all prompts from prompts.txt
const getPrompts = () => {
    const data = fs.readFileSync(promptsFilePath, 'utf-8');
    return data.split('\n').filter((line) => line.trim() !== '');
};

// Endpoint to fetch a random prompt
app.get('/journal-prompt', (req, res) => {
    try {
        const prompts = getPrompts();
        if (prompts.length === 0) {
            return res.status(404).send('No prompts found.');
        }

        const randomIndex = Math.floor(Math.random() * prompts.length);
        const randomPrompt = prompts[randomIndex];

        // Write the selected prompt to a text file
        fs.writeFileSync(selectedPromptFilePath, randomPrompt, 'utf-8');
        console.log(`New prompt written to selectedPrompt.txt: "${randomPrompt}"`);

        res.json({ prompt: randomPrompt });
    } catch (error) {
        console.error('Error fetching random prompt:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the microservice
app.listen(PORT, () => {
    console.log(`Journal Prompt Microservice running on localhost:${PORT}`);
});