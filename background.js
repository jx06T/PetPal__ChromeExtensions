chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sampleContextMenu",
        title: "Fish",
        contexts: ["page"],
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
        // chrome.tabs.create({ url: "https://www.youtube.com" });
        // chrome.scripting.executeScript({
        //     target: { tabId: tab.id },
        //     files: ["createbug.js"],
        // })
        // chrome.scripting.insertCSS({
        //     target: { tabId: tab.id },
        //     files: ['ttttt.css']
        // });

        chrome.tabs.sendMessage(tab.id, { greeting: "NewFish" });

        // (async () => {
        //     const response = await chrome.tabs.sendMessage(tab.id, { greeting: "掰掰lo" });
        //     // do something with response here, not outside the function

        //    

        // })();

    }
});
