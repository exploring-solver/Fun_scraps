const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the target webpage
  console.log('Navigating to the webpage...');
  await page.goto('https://stake.bet/casino/games/slide', { waitUntil: 'domcontentloaded' });

  let selectorFound = false;
  let elapsedTime = 0;
  const maxWaitTime = 10000;
  const intervalTime = 1000;

  while (elapsedTime < maxWaitTime) {
    console.log(`Checking for the selector at ${elapsedTime}ms...`);

    selectorFound = await page.evaluate(selector => {
      return !!document.querySelector(selector);
    }, '.past-games.svelte-ykvw8m.full button.button-tag.variant-success.custom-colors.svelte-19x9wh5');

    if (selectorFound) {
      console.log('Selector found!');
      break;
    }

    // Take a snapshot of the current DOM for debugging
    const pageContent = await page.content();
    fs.writeFileSync(`debug_${elapsedTime}.html`, pageContent);

    await page.waitForTimeout(intervalTime);
    elapsedTime += intervalTime;
  }

  if (!selectorFound) {
    console.error(`Selector not found within ${maxWaitTime}ms.`);
  } else {
    console.log('Proceeding with the extraction...');

    const buttonDataArray = await page.evaluate(() => {
      const pastGamesDiv = document.querySelector('.past-games.svelte-ykvw8m.full');
      const buttonDataArray = [];

      if (pastGamesDiv) {
        const buttons = pastGamesDiv.querySelectorAll('button.button-tag.variant-success.custom-colors.svelte-19x9wh5');
        buttons.forEach(button => {
          const buttonData = {
            lastGameIndex: button.getAttribute('data-last-game-index'),
            pastGameId: button.getAttribute('data-past-game-id'),
            buttonBackground: button.style.getPropertyValue('--button-background'),
            buttonForeground: button.style.getPropertyValue('--button-foreground'),
            buttonHover: button.style.getPropertyValue('--button-hover'),
            content: button.querySelector('.contents span')?.textContent || '',
          };
          buttonDataArray.push(buttonData);
        });
      }

      return buttonDataArray;
    });

    // Convert the array to a JSON string
    const jsonData = JSON.stringify(buttonDataArray, null, 2);

    // Write the JSON data to a log file
    fs.writeFile('log.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Data successfully written to log.json');
      }
    });
  }

  // Close the browser
  await browser.close();
})();
