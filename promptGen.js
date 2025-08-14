import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import env from "dotenv";
env.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function main() {

    let historyString = fs.readFileSync("history.txt").toString();
    let history = JSON.parse(historyString);

    const chat = await ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,

    });
   const res=  await chat.sendMessage({
        message: "What is my api key?",
        }

    )
    history = [...chat.getHistory(false)];
    let historyJson = JSON.stringify(history,null,2);
    await fs.writeFileSync("history.txt" , historyJson)

    console.log(res.text);
}

await main();