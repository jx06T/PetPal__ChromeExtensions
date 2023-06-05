function initiallll(switch1, switch2) {
    switch1.checked = localStorage.getItem('switch1_S') != "false";
    switch2.checked = localStorage.getItem('switch2_S') != "false";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "ChangeState", data: { checked: !!switch1.checked, NewState: 7 } })
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "ChangeClass", data: { checked: !!switch2.checked, Myclass: switch2.dataset.myclass } })
    });
}
document.addEventListener('DOMContentLoaded', function () {

    const switch1 = document.getElementById('switch1');
    const switch2 = document.getElementById('switch2');
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    const CreateButton = document.getElementById('createButton');
    initiallll(switch1, switch2)

    switch1.addEventListener("change", () => {
        localStorage.setItem('switch1_S', switch1.checked);
        console.log(!!switch1.checked)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "ChangeState", data: { checked: !!switch1.checked, NewState: 7 } })
        });
    })
    switch2.addEventListener("change", () => {
        localStorage.setItem('switch2_S', switch2.checked);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "ChangeClass", data: { checked: !!switch2.checked, Myclass: switch2.dataset.myclass } })
        });
    })
    // 将数据保存到chrome.storage并发送消息给content.js
    CreateButton.addEventListener('click', () => {
        const aPet = {
            size: slider1.value,
            color: slider2.value
        };
        // 保存数据到chrome.storage
        chrome.storage.local.get(["Pets"]).then((result) => {
            let pets = result.Pets;
            console.log(pets)
            pets.push(aPet)
            chrome.storage.local.set({ Pets: pets }).then(() => {
                console.log('Data saved: ', pets);
            });
        });
        // 发送消息给content.js
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "NewPet", data: aPet })
        });
    });
});