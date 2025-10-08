import { chromium } from 'playwright';

export interface ScrapedApp {
  id: string;
  name: string;
  description?: string;
  creator?: string;
  users?: number;
  revenue?: number;
  homepageUrl?: string;
  profilePictureUrl?: string;
}

export async function scrapeTopApps(): Promise<ScrapedApp[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the top apps page
    await page.goto('https://echo.merit.systems/top-apps', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for apps to load - adjust selector based on actual page structure
    await page.waitForSelector('[data-testid="app-card"], .app-card, article, [class*="card"]', {
      timeout: 10000
    });

    // Extract app data from the page
    const apps = await page.evaluate(() => {
      const appCards = Array.from(document.querySelectorAll('[data-testid="app-card"], .app-card, article, [class*="card"]'));

      return appCards.map((card, index) => {
        // Try to extract app information from various possible selectors
        const nameEl = card.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"]');
        const descEl = card.querySelector('p, [class*="description"]');
        const creatorEl = card.querySelector('[class*="creator"], [class*="author"], [class*="by"]');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('a[href]');

        // Extract numbers (users/revenue)
        const text = card.textContent || '';
        const userMatch = text.match(/(\d+[\d,]*)\s*(?:users?|subscribers?)/i);
        const revenueMatch = text.match(/\$\s*([\d,]+)/);

        return {
          id: `app-${index}`,
          name: nameEl?.textContent?.trim() || `App ${index + 1}`,
          description: descEl?.textContent?.trim(),
          creator: creatorEl?.textContent?.trim()?.replace(/^by\s+/i, ''),
          users: userMatch ? parseInt(userMatch[1].replace(/,/g, '')) : undefined,
          revenue: revenueMatch ? parseInt(revenueMatch[1].replace(/,/g, '')) : undefined,
          profilePictureUrl: imgEl?.src,
          homepageUrl: linkEl?.href,
        };
      }).filter(app => app.name && app.name !== 'App 0'); // Filter out invalid apps
    });

    await browser.close();
    return apps;
  } catch (error) {
    await browser.close();
    console.error('Scraping error:', error);
    throw error;
  }
}
