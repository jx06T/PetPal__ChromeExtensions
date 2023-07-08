chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sampleContextMenu",
        title: "Fish",
        contexts: ["all"],
        // type :"checkbox"
    });
});

function debug(...d) {
    console.log(d);
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: debug,
        args: [info]
    });
    if (info.menuItemId === "sampleContextMenu") {
        chrome.tabs.sendMessage(tab.id, { greeting: "NewFish" });
    }

});
chrome.commands.onCommand.addListener((command, tab) => {
    if (command == "Sharp") {
        chrome.tabs.sendMessage(tab.id, { greeting: "Sharp" });
    }
});
