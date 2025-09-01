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
        message: "This template uses placeholders that you have to customize.\n" +
            "\n" +
            "\"A photorealistic, miniature version of [Object], made as a with glass texture with vibrant colors representing real,bright background is cut by a by a Kitchen knife.Cut the core then reveals some substance of gradient of color [color] and [color] oozes out.\"\n" +
            "\n" +
            "Everytime I use the word \"Create\" give me a complete prompt that replaces the above template by using some different astronomical object of the universe and replace the [Object] with that of a particular object.\n" +
            "\n" +
            "Note: Choose some random planet, star, Black Holes or other Astronomical like: Asteroids, Galaxies bodies each time I prompt say \"Create\" just mention the prompt and nothing else.",
        }

    )
    history = [...chat.getHistory(false)];
    let historyJson = JSON.stringify(history,null,2);
    await fs.writeFileSync("history.txt" , historyJson)

    console.log(res.text);
}

await main();