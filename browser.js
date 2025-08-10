import puppet from "puppeteer";

async function main() {

    const browser = await puppet.launch({headless: false});

    const page = await browser.newPage();

    await page.goto("https://gemini.google.com/app");
}

main()