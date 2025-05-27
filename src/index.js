const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 10000;

let statsCache = {};

async function scrapeWallboard() {
  try {
    // Debug: Log the executable path and environment variables
    console.log('PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH);
    console.log('PUPPETEER_CACHE_DIR:', process.env.PUPPETEER_CACHE_DIR);

    // Use the environment variable if set, otherwise fallback to default
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

    // Launch Puppeteer with Render-compatible options
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto('https://499977.callswitchone.com/wallboard/tm-statsg', { waitUntil: 'networkidle2' });

    // Scrape the stats (adjust selectors based on actual HTML structure)
    const stats = await page.evaluate(() => {
      const users = [
        { id: '1005', dashboardId: 'freddie' },
        { id: '1006', dashboardId: 'efan' },
        { id: '1007', dashboardId: 'levi' },
        { id: '1002', dashboardId: 'jordan' }
      ];
      const data = {};
      users.forEach(user => {
        const element = document.querySelector(`.user-stats[data-user-id="${user.id}"]`);
        if (element) {
          data[user.dashboardId] = {
            calls: parseInt(element.querySelector('.calls-made')?.textContent) || 0,
            answeredCalls: parseInt(element.querySelector('.answered-calls')?.textContent) || 0,
            talkTime: Math.floor(parseInt(element.querySelector('.talk-time')?.textContent) / 60) || 0
          };
        } else {
          data[user.dashboardId] = { calls: 0, answeredCalls: 0, talkTime: 0 };
        }
      });
      return data;
    });

    statsCache = stats;
    await browser.close();
  } catch (error) {
    console.error('Error scraping wallboard:', error);
  }
}

// Initial scrape and schedule every 30 seconds
scrapeWallboard();
setInterval(scrapeWallboard, 30000);

app.get('/stats', (req, res) => {
  res.json(statsCache);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
