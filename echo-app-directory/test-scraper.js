const { chromium } = require('playwright');

async function testScraper() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to top apps page...');
    await page.goto('https://echo.merit.systems/top-apps', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    console.log('Waiting for content to load...');
    // Wait a bit more for dynamic content
    await page.waitForLoadState('networkidle').catch(() => console.log('Network idle timeout, continuing...'));
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take a screenshot to see what we're working with
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('Screenshot saved to screenshot.png');

    // Try different selectors
    const html = await page.content();
    console.log('\n=== Page HTML Preview (first 1000 chars) ===');
    console.log(html.substring(0, 1000));

    // Look for card-like elements
    const possibleSelectors = [
      'article',
      '[class*="card"]',
      '[class*="Card"]',
      '[data-testid*="app"]',
      'div[class*="grid"] > div',
      'a[href*="/app/"]'
    ];

    for (const selector of possibleSelectors) {
      const count = await page.locator(selector).count();
      console.log(`\nFound ${count} elements matching: ${selector}`);

      if (count > 0 && count < 100) {
        // Get the first few elements' HTML
        const elements = await page.locator(selector).all();
        for (let i = 0; i < Math.min(3, elements.length); i++) {
          const html = await elements[i].innerHTML();
          console.log(`\nElement ${i + 1} HTML (first 500 chars):`);
          console.log(html.substring(0, 500));
        }
      }
    }

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    await browser.close();
  }
}

testScraper();
