const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });
  
  // Navigate to the site
  await page.goto('http://localhost:3001');
  
  // Wait for terminal to load
  await page.waitForTimeout(3000);
  
  // Take initial screenshot
  await page.screenshot({ path: '/Users/otisscott/Projects/otisscott-me/screenshots/01-initial.png' });
  
  // Type help command
  await page.keyboard.type('help');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/otisscott/Projects/otisscott-me/screenshots/02-help-typed.png' });
  
  // Press enter
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/otisscott/Projects/otisscott-me/screenshots/03-help-output.png' });
  
  // Type ls
  await page.keyboard.type('ls');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/otisscott/Projects/otisscott-me/screenshots/04-ls.png' });
  
  // Type skills
  await page.keyboard.type('skills');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/otisscott/Projects/otisscott-me/screenshots/05-skills.png' });
  
  // Type neofetch
  await page.keyboard.type('neofetch');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/otisscott/Projects/otisscott-me/screenshots/06-neofetch.png' });
  
  await browser.close();
  console.log('Screenshots saved to /Users/otisscott/Projects/otisscott-me/screenshots/');
})();
