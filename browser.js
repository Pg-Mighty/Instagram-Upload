import puppet from "puppeteer";
import path from "path";

async function main() {

    const prompt = "Cinematic & Detailed Version (Avocado Interior) This prompt adds more descriptive language, camera movement, and specifies a different fruit for a unique feel. The avocado pit is a great stand-in for the Earth's core.Extreme close-up, slow motion. A chef's knife glides smoothly through a miniature crystal globe of Planet Earth. The camera focuses on the blade as it cuts. The cross-section reveals the unexpected interior of a ripe avocado, with soft green flesh and a large brown seed at the center. Cinematic, shallow depth of field, ASMR-style satisfying video, dramatic studio lighting against a dark background."+"\n";
    const userDataDir = path.resolve(process.cwd(), 'myUserData');
    console.log(`Using user data directory: ${userDataDir}`);

    const browser = await puppet.launch({
        headless: false,
        userDataDir: userDataDir,
        args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36']
    });

    const page = await browser.newPage();
    await page.goto("https://gemini.google.com/app", {waitUntil: 'networkidle2'});
    if(page.locator('button').filter((button)=> button.innerText === "Got it").visibility != null)
    {
        await page.locator('button').filter((button)=> button.innerText === "Got it").click();
    }

        await page.click('button[matripple][aria-pressed="false"]');
        await page.locator('p').fill(prompt);


        await page.on("response" , async(res) => {
            const url = res.url();
            if (url.includes("https://contribution.usercontent.google.com/download?c=")) {
                // await res.text()
            }

        })

}

main();
