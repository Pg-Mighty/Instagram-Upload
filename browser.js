import puppet from "puppeteer";
import path from "path";

async function main() {

    // Use a dedicated directory to store user data
    const userDataDir = path.resolve(process.cwd(), 'myUserData');
    console.log(`Using user data directory: ${userDataDir}`);

    const browser = await puppet.launch({
        headless: false,
        userDataDir: userDataDir, // This is the magic line
        // For better compatibility, match the user agent of your regular browser
        args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36']
    });

    const page = await browser.newPage();
    await page.goto("https://gemini.google.com/app", { waitUntil: 'networkidle2' });


    console.log("Page loaded. Check if you are logged in.");

    await new Promise(resolve => setTimeout(resolve, 60000)); // wait 60 seconds

    await browser.close();
}

main();