function fetchAndStoreSyncedTabs() {
  chrome.sessions.getDevices((devices) => {
    if (chrome.runtime.lastError) {
      console.error("Error fetching devices:", chrome.runtime.lastError);
      return;
    }

    const syncedTabs = devices
      .flatMap((device) =>
        device.sessions.flatMap((session) =>
          session.window?.tabs?.map((tab) => ({
            title: tab.title,
            url: tab.url,
            deviceName: device.deviceName,
          })),
        ),
      )
      .filter(Boolean);

    if (syncedTabs.length > 0) {
      console.log("Synced tabs found:", syncedTabs);
      chrome.storage.local.set({ syncedTabs });
    } else {
      console.log("No synced tabs found");
    }
  });
}

chrome.action.onClicked.addListener(() => {
  fetchAndStoreSyncedTabs();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchSyncedTabs") {
    fetchAndStoreSyncedTabs();
    sendResponse({ status: "fetching" });
  }
});
