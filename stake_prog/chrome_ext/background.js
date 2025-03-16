chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'LOG_DATA') {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        data: request.data
      };
      
      // Store in chrome.storage
      chrome.storage.local.get(['gameLog'], (result) => {
        const gameLog = result.gameLog || [];
        gameLog.push(logEntry);
        chrome.storage.local.set({ gameLog });
      });
    }
  });