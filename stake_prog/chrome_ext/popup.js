document.getElementById('viewDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3001' });
  });