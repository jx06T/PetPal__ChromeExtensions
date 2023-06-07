
function send(data, switch1 = null, switch2 = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, data).then((r) => {
            if (!switch1) return
            switch1.checked = r.sleeping;
            switch2.checked = r.invisible;
        })
    });
}
function reset() {
    chrome.storage.local.set({ Pets: [{ size: 120, color: 0 }] }).then(() => {
        console.log('Data saved');
    });
}
document.addEventListener('DOMContentLoaded', function () {

    const MyPet = document.querySelector('.jx06pet');
    console.log(MyPet)
    MyPet.style.height = 120 + "px";
    MyPet.style.filter = "blur(0px) hue-rotate(" + 0 + "deg)";
    const switch1 = document.getElementById('switch1');
    const switch2 = document.getElementById('switch2');
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    send({ greeting: "GetSTATE" }, switch1, switch2)


    const CreateButton = document.getElementById('createButton');
    switch1.addEventListener("change", () => {
        send({ greeting: "ChangeSTATE", data: { sleeping: !!switch1.checked, invisible: !!switch2.checked } })

    })
    switch2.addEventListener("change", () => {
        send({ greeting: "ChangeSTATE", data: { sleeping: !!switch1.checked, invisible: !!switch2.checked } })

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
        send({ greeting: "NewPet", data: aPet })
    });
});
// reset()

