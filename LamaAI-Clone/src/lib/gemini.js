import { GoogleGenerativeAI }   from "@google/generative-ai"
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";

//safty setting 
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings:safetySettings });



export default model


