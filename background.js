chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sampleContextMenu",
        title: "Fish",
        contexts: ["all"],
        // type :"checkbox"
    });
});
function randId() {
    return Math.random().toString(36).substring(2.9) + Math.random().toString(36).substring(2.9)
}
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
    } else if (command == "NewPet") {
        const aPet = {
            size: Math.floor(Math.random() * 260 + 40),
            color: Math.floor(Math.random() * 360),
            id: randId()
        };

        // 保存数据到chrome.storage
        chrome.storage.local.get(["Pets"]).then((result) => {
            let pets = result.Pets;
            if (!pets) {
                pets = []
            }
            pets.push(aPet)
            chrome.storage.local.set({ Pets: pets }).then(() => {
            });
        });
        chrome.tabs.sendMessage(tab.id, { greeting: "NewPet", data: aPet });
    } else if (command == "isDeactivate") {
        chrome.storage.local.get(["isDeactivate"]).then((result) => {
            isDeactivate = result.isDeactivate;
            chrome.storage.local.set({ isDeactivate: !isDeactivate }).then(() => {
            });
            chrome.tabs.sendMessage(tab.id, { greeting: "isDeactivate", data: !isDeactivate })
        });
    } else if (command == "invisible") {
        chrome.storage.local.get(["invisible"]).then((result) => {
            invisibleee = result.invisible;
            chrome.storage.local.set({ invisible: !invisibleee }).then(() => {
            });
            chrome.tabs.sendMessage(tab.id, { greeting: "ChangeSTATE", data: { sleeping: null, invisible: !invisibleee } })
        });
    }
});
