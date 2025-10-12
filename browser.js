import puppet from "puppeteer";
import path from "path";
import upload from "./awsupload.js";


async function run(promptArray)  {
    let videoArray= [];

    const userDataDir = path.resolve(process.cwd(), 'myUserData');
    console.log(`Using user data directory: ${userDataDir}`);

    const browser = await puppet.launch({
        headless: false,
        userDataDir: userDataDir,
        args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36']
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    await page.goto("https://gemini.google.com/app", { waitUntil: 'domcontentloaded' });
    await new Promise((resolve)=> setTimeout(resolve,10000));



    // Annoying popup

    try{
        if (page.locator('::-p-text(No, thanks)')) {
            await page.click('::-p-text(No, thanks)');
        }
        }catch {

            await page.click('button[aria-label="Tools"]');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.click('::-p-text(Create videos with Veo)');
            //  console.log(promptArray);

            for (let i = 0; i < 3; i++) {
                console.log(i);
                await page.locator('div[data-placeholder="Describe your video"]').fill(promptArray[i]);
                await new Promise(resolve => setTimeout(resolve, 50000));
                if(i === 2){
                    console.log("Loading all videos...");

                        let video1 =  listen(page);
                        await new Promise(resolve=> setTimeout(resolve,900));
                        let video2 =  listen(page);
                        await new Promise(resolve=> setTimeout(resolve,900));
                        let video3 =  listen(page);

                        videoArray = await Promise.all([video1, video2, video3]);
                        console.log("Pushed");


                }else {
                    await listen(page);
                    console.log("Generated Video " + (i+1));

                }

            }

            upload(videoArray)
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
