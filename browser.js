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
            await page.click('::-p-text(Create videos (Veo 3.1))');
            //  console.log(promptArray);

            for (let i = 0; i < 3; i++) {
                console.log(i+1);
                await page.locator('div[data-placeholder="Describe your video"]').fill(promptArray[i]);


                if(i===2) {
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    videoArray = await listen(page);
                    console.log("Generated Video "+ (i+1));
                }else {
                    await new Promise(resolve => setTimeout(resolve, 100000));
                }


            }
            console.log("Uploading all");
            upload(videoArray)
            await browser.close();

        }
}

 function listen(page) {
    let baseArray = [];

     return new Promise((resolve, reject) => {
         const timeout = setTimeout(() => {
             reject(new Error("Timeout 2min"))
         }, 120000);

         const handler = async response => {

             for (let i = 0; i < 3; i++) {
                 if (response.url().includes("https://contribution.usercontent.google.com/download?c=")) {
                     clearTimeout(timeout);


                     try {
                         const buffer = await response.buffer();
                         const base64 = buffer.toString("base64");
                         baseArray.push(base64);
                         await new Promise(resolve1 => setTimeout(resolve1,100))
                     } catch (err) {
                         reject(err);
                     }
                 }
             }
             resolve(baseArray);
             page.off("response", handler);
         };
         page.on("response", handler);
     });

}
export default run;
