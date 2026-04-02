import puppet from "puppeteer";
import path from "path";
import upload from "./awsupload.js";
import fs from "fs";

/**
 * Robust listener using CDP to capture streaming video data in chunks.
 * Prevents the "No data found for resource" Protocol Error.
 */
function listenForStream(page) {
    return new Promise(async (resolve, reject) => {
        let client;
        try {
            client = await page.target().createCDPSession();
        } catch (e) {
            return reject(e);
        }

        await client.send('Network.enable');

        const requestChunks = new Map();
        let targetRequestId = null;

        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Timeout: Did not receive the video stream within 125 seconds."));
        }, 125000);

        const cleanup = () => {
            clearTimeout(timeout);
            if (client) {
                client.off('Network.responseReceived', onResponse);
                client.off('Network.dataReceived', onDataReceived);
                client.off('Network.loadingFinished', onLoadingFinished);
                client.detach().catch(() => {});
            }
        };

        const onResponse = (event) => {
            if (event.response.url.includes("https://contribution.usercontent.google.com/download?c=")) {
                targetRequestId = event.requestId;
            }
        };

        const onDataReceived = (event) => {
            if (!requestChunks.has(event.requestId)) requestChunks.set(event.requestId, []);
            if (event.data) {
                const chunk = Buffer.from(event.data, event.base64Encoded ? 'base64' : 'utf8');
                requestChunks.get(event.requestId).push(chunk);
            }
        };

        const onLoadingFinished = (event) => {
            if (event.requestId === targetRequestId) {
                cleanup();
                const chunks = requestChunks.get(targetRequestId) || [];
                const finalBuffer = Buffer.concat(chunks);
                resolve(finalBuffer.toString("base64"));
            }
        };

        client.on('Network.responseReceived', onResponse);
        client.on('Network.dataReceived', onDataReceived);
        client.on('Network.loadingFinished', onLoadingFinished);
    });
}

async function run(promptArray) {
    let videoArray = [];
    const userDataDir = path.resolve(process.cwd(), 'myUserData');

    const browser = await puppet.launch({
        headless: false,
        userDataDir: userDataDir,
        args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36']
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    await page.goto("https://gemini.google.com/app", { waitUntil: 'domcontentloaded' });

    // Handle Popups and Navigation
    try {
        const noThanks = await page.waitForSelector('::-p-text(No, thanks)', { timeout: 5000 });
        if (noThanks) await noThanks.click();
    } catch (e) {
        console.log("Popup not found, continuing....");
    }

    // Navigate to VEO
    await page.waitForSelector('button[aria-label="Tools"]');
    await page.click('button[aria-label="Tools"]');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('::-p-text(Videos)');

    for (let i = 0; i < promptArray.length; i++) {
        console.log(`Processing prompt ${i + 1}/${promptArray.length}`);

        // Start listening BEFORE triggering the generation


        // Fill prompt
        const inputSelector = 'div[data-placeholder="Describe your video"]';
        await page.waitForSelector(inputSelector);
        await page.click(inputSelector);
        await page.keyboard.sendCharacter(promptArray[i]);
        await new Promise(r => setTimeout(r, 5000));
        await page.click('mat-icon[fonticon="send"]');


        console.log("Waiting for generation...");
        await new Promise(r => setTimeout(r, 15000)); // 15 sec wait
        try {
            const base64Video = await listenForStream(page);
            videoArray.push(base64Video);
            console.log(`Successfully generated video ${i + 1}`);
            await new Promise(r=> setTimeout(r, 3000));
        } catch (err) {
            console.error(`Failed to generate video ${i + 1}:`, err.message);
        }
    }

    console.log("Generation completed. Uploading...");
    if (videoArray.length > 0) {
        fs.writeFileSync("request.txt", JSON.stringify(videoArray));
        console.log(videoArray[0]);
        await upload(videoArray);
    }

    await browser.close();
}

export default run;