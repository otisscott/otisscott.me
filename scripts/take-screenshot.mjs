import { chromium } from 'playwright';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark'
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for terminal to fully initialize
  await sleep(3000);

  // Click on the terminal to focus it
  await page.click('.xterm', { force: true });
  await sleep(500);

  // Type neofetch
  await page.keyboard.type('neofetch', { delay: 40 });
  await sleep(200);
  await page.keyboard.press('Enter');
  await sleep(2000);

  // Type ls
  await page.keyboard.type('ls', { delay: 40 });
  await sleep(200);
  await page.keyboard.press('Enter');
  await sleep(1000);

  await page.screenshot({
    path: 'screenshots/readme-hero.png',
    type: 'png'
  });

  console.log('Screenshot saved to screenshots/readme-hero.png');
  await browser.close();
})();
