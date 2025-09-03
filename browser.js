import puppet from "puppeteer";
import path from "path";
import upload from "./awsupload.js";


async function run(prompt) {
    const userDataDir = path.resolve(process.cwd(), 'myUserData');
    console.log(`Using user data directory: ${userDataDir}`);

    const browser = await puppet.launch({
        headless: false,
        userDataDir: userDataDir,
        args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36']
    });

    const page = await browser.newPage();
    await page.goto("https://gemini.google.com/app", {waitUntil: 'networkidle2'});
    new Promise((resolve)=> setTimeout(resolve,10000));

    // Annoying popup
    try {
        if (page.locator('::-p-text(No, thanks)')) {
            await page.click('::-p-text(No, thanks)');
        }
    }catch(e) {

        await page.click('mat-icon[fonticon="page_info"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.click('::-p-text(Create videos with Veo)');
        await page.locator('p').fill(prompt);


        await new Promise(resolve => setTimeout(resolve, 50000));

        let videoBase64 = await listen(page);

        const videoBuffer = Buffer.from(videoBase64, "base64");////    THis Line

        upload(videoBuffer);

        await browser.close();
    }
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
export default run;
