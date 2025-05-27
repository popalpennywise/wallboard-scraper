const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

let statsCache = {};

async function scrapeWallboard() {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://499977.callswitchone.com/wallboard/tm-statsg', { waitUntil: 'networkidle2' });

    // Add authentication if needed (update with your credentials)
    // await page.setCookie({ name: 'session', value: 'your-session-token' });

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

scrapeWallboard();
setInterval(scrapeWallboard, 30000);

app.get('/stats', (req, res) => {
  res.json(statsCache);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
