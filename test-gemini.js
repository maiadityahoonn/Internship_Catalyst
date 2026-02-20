const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI("AIzaSyBlpotQZpC9pWKmKlLXDbtEefx2XTatje0");

async function listModels() {
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Attempting to list models...");
        // The SDK doesn't have a direct listModels on the main class in all versions, 
        // but we can try a simple generation to check connectivity.
        const response = await result.generateContent("test");
        console.log("Connection successful!");
        console.log(response.response.text());
    } catch (err) {
        console.error("Error details:", err);
    }
}

listModels();
