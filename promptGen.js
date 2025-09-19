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
    const res1 = await chat.sendMessage({
            message: "Create",
        }
    )
    const res2 = await chat.sendMessage({
            message: "Create",
        }
    )
    const res3 = await chat.sendMessage({
            message: "Create",
        }
    )
    history = [...chat.getHistory(false)];
    let historyJson = JSON.stringify(history, null, 2);
    await fs.writeFileSync("history.txt", historyJson)

    const promptArray = [res1.text + "/n", res2.text+ "/n", res3.text+ "/n"];

   await run(promptArray);
}

export default main;