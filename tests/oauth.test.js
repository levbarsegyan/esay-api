import puppeteer from 'puppeteer';
(async () => {
    try {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 25,
        args: ["--window-size=1920,1080"],
        ignoreDefaultArgs: ["--enable-automation"]
    });
    const page = await browser.newPage();
    const pages = await browser.pages();
    if (pages.length > 1) {
        await pages[0].close();
    }
    await page._client.send("Emulation.clearDeviceMetricsOverride");
    await page.goto("https:
    const email = await page.waitForSelector('input[type="text"]');
    await email.click();
    await page.keyboard.type("Seamount-Ai");
    const password = await page.waitForSelector('input[type="password"]');
    await password.click();
    await page.keyboard.type("jaitresfaim1");
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const url = new URL(await page.url());
    const code = url.searchParams.get('code');
	console.log(url);
    }
    catch (e) {
        console.log("Err", e);
    }
})();
