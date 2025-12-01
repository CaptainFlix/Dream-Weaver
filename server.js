// Import the packages we installed
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // This loads the API_KEY from the .env file

// Setup the server
const app = express();
app.use(express.json()); // Allows our server to understand JSON data sent from the front-end
app.use(express.static('.')); // Allows our server to show our index.html file

// Initialize the Google AI client with our secret key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Create an API endpoint for generating stories
app.post('/generate-story', async (req, res) => {
    try {
        // Get all possible inputs from the front-end
        const { dreamFragments, pageCount, existingStory, newFragments } = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt;

        // --- Logic to choose the right prompt ---

        if (existingStory && newFragments) {
            // SCENARIO 1: Adding to an existing story
            prompt = `You are The Dream Weaver, a master storyteller. Here is a story you've already started:
            ---
            ${existingStory}
            ---
            The user wishes to add new elements to this narrative. Here are the new fragments they provided: "${newFragments}".
            Your task is to seamlessly weave these new fragments into the existing story. You can expand, rewrite, or continue the story to make the new elements feel natural and essential, while preserving the original mysterious and literary tone. Produce a single, cohesive, updated story.`;
        
        } else {
            // SCENARIO 2: Generating a new story
            const wordCountMap = { '1': "170-200", '2': "250-300" };
            const targetWords = wordCountMap[pageCount] || "170-200";

            prompt = `You are The Dream Weaver, a mystical storyteller. A user has shared these fragmented memories from their dream: "${dreamFragments}". 
            Expand these fragments into a short story of approximately ${targetWords} words.
            The story should be cohesive, magical, and written in a reflective, slightly mysterious, and literary tone.
            Do not break character. Do not say "Here is the story". Begin the story directly.`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ story: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to weave the dream.' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Dream Weaver's loom is active at http://localhost:${PORT}`);
});