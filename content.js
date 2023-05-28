class aPet {
    // 建構函式
    constructor(x, y, height) {
        if (x === "random") {
            x = Math.random() * (window.innerWidth - height * 0.8 - 30) + 15
            y = Math.random() * (window.innerHeight - height * 0.9 - 30) + 15
        }
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;

        const myimg = document.createElement("img");
        myimg.src = GetImgURL("pet_rest")
        myimg.id = "jx06cnjlwadifj";
        myimg.setAttribute("class", "jx06pet");
        document.body.insertBefore(myimg, document.body.firstChild);
        myimg.style.position = 'fixed';
        // myimg.style.position = 'absolute';
        myimg.style.height = height + "px";
        myimg.style.left = x + "px";
        myimg.style.top = y + "px";
        this.img = myimg
    }

}
function GetImgURL(name) {
    return "https://raw.githubusercontent.com/jx06T/PetImg/main/" + name + ".gif"
}
new aPet("random", "random", 120)
// -----------------------------------------------------------------------
let MouseX = 0;
let MouseY = 0;
document.addEventListener('mousemove', (event) => {
    MouseX = event.clientX;
    MouseY = event.clientY;
});

// -----------------------------------------------------------------------
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ? "from " + sender.tab.url : "from the extension");
        console.log(request.greeting)

        sendResponse({ farewell: "ok" });
    }
);

// -----------------------------------------------------------------------
