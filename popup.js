document.addEventListener("DOMContentLoaded", () => {
  // Request synced tabs from background.js
  chrome.runtime.sendMessage({ action: "fetchSyncedTabs" }, (response) => {
    if (response.status === "fetching") {
      console.log("Fetching synced tabs from background.js...");
      // Delay retrieval to ensure data is fetched
      setTimeout(loadSyncedTabs, 1000);
    }
  });
});

function loadSyncedTabs() {
  chrome.storage.local.get(["syncedTabs"], ({ syncedTabs }) => {
    const list = document.getElementById("syncedTabsList");

    if (syncedTabs && syncedTabs.length > 0) {
      syncedTabs.forEach((tab) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="${tab.url}" target="_blank">${tab.deviceName} - ${tab.title}</a>`;
        list.appendChild(listItem);
      });
    } else {
      console.log("No synced tabs found or data hasn't been stored.");
      list.innerHTML = "<li>No synced tabs available.</li>";
    }
  });
}
