
function send(data, switch1 = null, switch2 = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, data).then((r) => {
            if (!switch1) return
            switch1.checked = r.sleeping;
            // switch2.checked = r.invisible;
        })
    });
}
function reset() {
    chrome.storage.local.set({ Pets: [{ size: 120, color: 0, id: randId() }] }).then(() => {
        // console.log('Data saved');
    });
}
function randId() {
    return Math.random().toString(36).substring(2.9) + Math.random().toString(36).substring(2.9)
}
document.addEventListener('DOMContentLoaded', function () {

    const MyPet = document.querySelector('.jx06pet');
    MyPet.style.height = 120 + "px";
    MyPet.style.filter = "blur(0px) hue-rotate(" + 0 + "deg)";
    const switch1 = document.getElementById('switch1');
    const switch2 = document.getElementById('switch2');
    const switch3 = document.getElementById('switch3');
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    const CreateButton = document.getElementById('createButton');

    chrome.storage.local.get(["isDeactivate"]).then((result) => {
        switch3.checked = result.isDeactivate;
        CreateButton.disabled = result.isDeactivate;
    });
    chrome.storage.local.get(["invisible"]).then((result) => {
        switch2.checked = result.invisible;
    });
    
    send({ greeting: "GetSTATE" }, switch1, switch2)
    switch1.addEventListener("change", () => {
        send({ greeting: "ChangeSTATE", data: { sleeping: !!switch1.checked, invisible: !!switch2.checked } })

    })
    switch2.addEventListener("change", () => {
        chrome.storage.local.set({ invisible: !!switch2.checked }).then(() => {
        });
        send({ greeting: "ChangeSTATE", data: { sleeping: !!switch1.checked, invisible: !!switch2.checked } })
    })
    switch3.addEventListener("change", () => {
        chrome.storage.local.set({ isDeactivate: !!switch3.checked }).then(() => {
            // console.log('Data saved: ', !!switch3.checked);
        });
        CreateButton.disabled = !!switch3.checked;
        send({ greeting: "isDeactivate", data: !!switch3.checked })
    })

    slider1.addEventListener("input", () => {
        MyPet.style.height = slider1.value + "px";
    })
    slider2.addEventListener("input", () => {
        MyPet.style.filter = "blur(0px) hue-rotate(" + slider2.value + "deg)";
    })

    // 将数据保存到chrome.storage并发送消息给content.js
    CreateButton.addEventListener('click', () => {
        const aPet = {
            size: Number(slider1.value),
            color: Number(slider2.value),
            id: randId()
        };

        // 保存数据到chrome.storage
        chrome.storage.local.get(["Pets"]).then((result) => {
            let pets = result.Pets;
            if (!pets) {
                pets = []
            }
            // console.log(pets)
            pets.push(aPet)
            chrome.storage.local.set({ Pets: pets }).then(() => {
                // console.log('Data saved: ', pets);
            });
        });
        send({ greeting: "NewPet", data: aPet })
    });
});
// reset()

