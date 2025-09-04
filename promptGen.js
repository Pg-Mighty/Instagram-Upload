import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import env from "dotenv";
import run from "./browser.js";
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
    const res = await chat.sendMessage({
            message: "Create",
        }
    )
    history = [...chat.getHistory(false)];
    let historyJson = JSON.stringify(history, null, 2);
    await fs.writeFileSync("history.txt", historyJson)

    try {
        while(true) {
            await run(res.text + "\n");
            console.log("Waiting until next timeslot");
            await new Promise(resolve => setTimeout(resolve, 1000*60*60*8));
        }
    } catch (e) {
        await main();
    }
}

await main();