const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const serverless = require('serverless-http'); // Import serverless-http

// Log the OpenAI API Key to check if it's set correctly
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

const { organizeNotesByTopic } = require('./backend-services/openAIService'); // Ensure this function is correctly implemented

const app = express();
app.use(cors({
    origin: ['*'], // Replace with your frontend’s URL
    methods: ['POST', 'GET'],
    credentials: true
}));

app.use(express.json()); // Middleware to parse JSON body data

// API endpoint to handle the transcript and generate notes
app.post('/transcribe', async (req, res) => {
    try {
        const { transcript } = req.body; // Extract 'transcript' from the request body
        if (!transcript || typeof transcript !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing transcript.' });
        }

        // Generate notes based on the transcript
        const notes = await organizeNotesByTopic(transcript);  // Use your service function to generate notes
        if (!notes) {
            return res.status(500).json({ error: 'Failed to generate notes.' });
        }

        // Return the notes to the frontend
        res.json({ notes });
    } catch (error) {
        console.error('Error during note generation:', error);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports.handler = serverless(app); // Export the handler for Vercel
