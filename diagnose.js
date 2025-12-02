// diagnose.js
const API_KEY = "AIzaSyBMPsnOKRhAWzl0iYM9A55yTGRxV7-HOAE"; 

async function checkAvailableModels() {
    console.log("🔍 Checking what your API Key can actually see...");
    
    // We use the raw URL to bypass any library version issues
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ CRITICAL ERROR:");
            console.error(JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log("✅ SUCCESS! Here are the models your key can access:");
            console.log("------------------------------------------------");
            
            const modelNames = data.models.map(m => m.name);
            
            // Filter to just show the ones we care about to keep it readable
            const geminiModels = modelNames.filter(name => name.includes("gemini"));
            
            geminiModels.forEach(name => console.log(name));
            
            console.log("------------------------------------------------");
            
            // Specific check for the one we want
            if (modelNames.includes("models/gemini-1.5-flash")) {
                console.log("🌟 GOOD NEWS: 'models/gemini-1.5-flash' IS available!");
            } else {
                console.log("⚠️ BAD NEWS: 'models/gemini-1.5-flash' is MISSING from your list.");
            }
        }
    } catch (err) {
        console.error("Network Error:", err);
    }
}

checkAvailableModels();