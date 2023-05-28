const IMG_URL = "https://raw.githubusercontent.com/jx06T/PetPal__ChromeExtensions/main/images/"
let MouseX = 0;
let MouseY = 0;
const DELAY = 50
function GetRandXY() {
    return [Math.random() * (window.innerWidth - 140) + 70, Math.random() * (window.innerHeight - 160) + 80]
}
// -----------------------------------------------------------------------
class aPet {
    // 建構函式
    constructor(x, y, size) {
        this.size = size
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.d = 90;
        this.speed = 3

        this.destination = [x, y]
        this.distance = 0
        this.timer = 10
        this.state = 0
        this.touchM = 0

        const myimg = document.createElement("img");
        myimg.src = IMG_URL + "pet_rest.gif"
        myimg.id = "jx06cnjlwadifj";
        myimg.setAttribute("class", "jx06pet");
        document.body.insertBefore(myimg, document.body.firstChild);
        myimg.style.position = 'fixed';
        // myimg.style.position = 'absolute';
        myimg.style.height = size + "px";
        myimg.style.left = x + "px";
        myimg.style.top = y + "px";
        this.img = myimg
        // this.foods = [{ 'x': x, 'y': y }]
    }
    move() {
        if (this.distance < 0.5 && (this.state == 1 || this.state == 2)) {
            this.x -= this.vx
            this.y -= this.vy
            this.destination = MouseX + MouseY > 10 && this.state == 2 ? [MouseX, MouseY] : GetRandXY()
            this.vx = this.destination[0] - this.x
            this.vy = this.destination[1] - this.y
            this.distance = Math.sqrt(this.vx * this.vx + this.vy * this.vy) / this.speed
            this.vx = this.vx / this.distance
            this.vy = this.vy / this.distance
            if (this.distance > 3)
                this.img.src = IMG_URL + "pet_walk.gif"
        }
        if (this.state == 4) {
            this.d = this.d + 10
            return
        }

        this.distance -= this.state == 2 ? 1.5 : 1.1
        this.d = this.vx * 4
        this.x += this.vx
        this.y += this.vy
    }
    set() {
        this.timer -= DELAY / 1000
        if (this.timer < 0) {
            if (this.state == 0) {
                this.state = 1
                this.timer = 8
            } else if (this.state == 4 || this.state == 1 || this.state == 2) {
                this.state = this.state == 4 ? 5 : 0
                this.vx = 0
                this.vy = 0
                this.img.src = IMG_URL + "pet_rest.gif"
                this.timer = 10
            }

        }
        if (Math.sqrt((this.x - MouseX) * (this.x - MouseX) + (this.y - MouseY) * (this.y - MouseY)) < this.size * 0.35) {
            this.touchM = this.touchM + 1
            if (this.state == 0 || this.state == 1) {
                this.state = 2
                this.move()
                this.timer = 22
                return
            }
            if (this.touchM > 40) {
                this.touchM = 0
                if (this.state == 4) return
                this.state = 4
                this.img.src = IMG_URL + "pet_walk.gif"
                this.timer = 5
            } else if (this.touchM > 15) {
                this.move()
            }
        } else {
            this.touchM = this.touchM > 0 ? this.touchM - 1 : 0
            if (this.state == 5) {
                this.state = 0
            }
        }
        console.log(this.state)
    }
    draw() {
        this.img.style.left = this.x - this.img.offsetWidth / 2 + 'px';
        this.img.style.top = this.y - this.img.offsetHeight / 2.5 + 'px';
        this.img.style.transform = 'rotate(' + (this.d % 360) + 'deg)'
    }
}
// -----------------------------------------------------------------------
const MyPet = new aPet(...GetRandXY(), 120)

setInterval(() => {
    MyPet.move()
    MyPet.set()
    MyPet.draw()
}, DELAY);

// -----------------------------------------------------------------------
document.addEventListener('mousemove', (event) => {
    MouseX = event.clientX;
    MouseY = event.clientY;
});
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(sender.tab ? "from " + sender.tab.url : "from the extension");
        console.log(request.greeting)

        sendResponse({ farewell: "ok" });
    }
);

// -----------------------------------------------------------------------