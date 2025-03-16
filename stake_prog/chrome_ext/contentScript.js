// contentScript.js
function extractButtonData() {
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
}

const observer = new MutationObserver((mutations) => {
  const data = extractButtonData();
  if (data.length > 0) {
    fetch('http://localhost:3000/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data })
    });
  }
});

function startObserving() {
  const targetNode = document.querySelector('.past-games.svelte-ykvw8m.full');
  if (targetNode) {
    observer.observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: true
    });
    console.log('Started observing target node');
  } else {
    setTimeout(startObserving, 1000);
  }
}

startObserving();

// Export function to download logs
function downloadLogs() {
  chrome.storage.local.get(['gameLog'], (result) => {
    const gameLog = result.gameLog || [];
    const blob = new Blob([JSON.stringify(gameLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game_log_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Add download button to the page
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download Logs';
downloadButton.style.position = 'fixed';
downloadButton.style.top = '10px';
downloadButton.style.right = '10px';
downloadButton.style.zIndex = '9999';
downloadButton.addEventListener('click', downloadLogs);
document.body.appendChild(downloadButton);