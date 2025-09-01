import puppet from "puppeteer";
import path from "path";


async function main() {
    const prompt = "A photorealistic, miniature version of Earth, made as a photorealistic glass with colors representing real, is cut by a by a Kitchen knife.After Slicing the interior the left half tummbels while the right half stands upright represent the core from which some substance oozes out."+"\n";
    const userDataDir = path.resolve(process.cwd(), 'myUserData');
    console.log(`Using user data directory: ${userDataDir}`);

    const browser = await puppet.launch({
        headless: false,
        userDataDir: userDataDir,
        args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36']
    });

    const page = await browser.newPage();
    await page.goto("https://gemini.google.com/app", {waitUntil: 'networkidle2'});
    if(page.locator('button').filter((button)=> button.innerText === "Close").visibility != null)
    {
        await page.locator('button').filter((button)=> button.innerText === "Got it").click();
    }

    new Promise((resolve)=> setTimeout(resolve,10000));

    await page.click('mat-icon[fonticon="page_info"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('div.gds-label-l.label');
    await new Promise(resolve => setTimeout(resolve, 50000));

    await page.locator('p').fill(prompt);


    await new Promise(resolve => setTimeout(resolve, 50000));

    let videoBase64 = await listen(page);
    console.log("✅ Video received. Length:", videoBase64.length);

    // Save to file
    const videoBuffer = Buffer.from(videoBase64, "base64");
    console.log("🎥 Video saved as output.mp4");

    await browser.close();
}


 function listen(page) {

     return new Promise((resolve, reject) => {
         const timeout = setTimeout(() => {
             reject(new Error("Timeout 2min"))
         }, 120000);

         const handler = async response => {
             if (response.url().includes("https://contribution.usercontent.google.com/download?c=")) {
                 clearTimeout(timeout);
                 page.off("response", handler); 

                 try {
                     const buffer = await response.buffer();
                     const base64 = buffer.toString("base64");
                     resolve(base64);
                 } catch (err) {
                     reject(err);
                 }
             }
         };
         page.on("response", handler);
     });

}
main();
