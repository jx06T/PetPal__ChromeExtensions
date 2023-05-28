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
        this.speed = 6

        this.destination = [x, y]
        this.distance = 0
        this.timer = 10
        this.state = 0
        this.touchM = 0
        this.food

        const myimg = document.createElement("img");
        myimg.src = IMG_URL + "pet_rest.gif"
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
        if (this.state == 6 || this.distance < 0.5 && (this.state == 1 || this.state == 2)) {
            if (this.state == 6) {
                this.speed = 5 + 5 * fishes.length
                this.food = fishes[Math.floor(Math.random() * fishes.length)]
                this.destination = [this.food.x, this.food.y]
            } else {
                this.speed = 6
                this.destination = MouseX + MouseY > 1 && this.state == 2 ? [MouseX, MouseY] : GetRandXY()
                this.x -= this.vx
                this.y -= this.vy
            }
            this.vx = this.destination[0] - this.x
            this.vy = this.destination[1] - this.y
            this.distance = Math.sqrt(this.vx * this.vx + this.vy * this.vy) / this.speed
            this.vx = this.vx / this.distance
            this.vy = this.vy / this.distance
        }
        if (this.state == 4) {
            this.d = this.d + this.speed * (this.touchM + 1)
            return
        }
        this.distance -= this.state == 2 ? 1.4 : this.state == 1 ? 1.1 : 2.1
        if (this.vy < 3) {
            this.d = this.vx * 6
        } else {
            this.d += this.vx * 4.5
        }
        this.x += this.vx
        this.y += this.vy
    }
    set() {
        if (fishes.length > 0) {
            if (this.state != 6) {
                MyPet.state = 6
                MyPet.timer = 12
                this.img.src = IMG_URL + "pet_walk.gif"
            } else if (this.distance < 0.5) {
                this.food.eaten()
                this.state = 0
                this.timer = 10
                this.vx = 0
                this.vy = 0
            }
        }
        this.timer -= DELAY / 1000
        if (this.timer < 0) {
            if (this.state == 0) {
                this.state = 1
                this.timer = 8
                this.img.src = IMG_URL + "pet_walk.gif"
            } else if (this.state == 4 || this.state == 1 || this.state == 2) {
                this.state = this.state == 4 ? 5 : 0
                this.timer = this.state == 4 ? 18 : 10
                this.vx = 0
                this.vy = 0
                this.img.src = IMG_URL + "pet_rest.gif"
            }

        }
        if (Math.sqrt((this.x - MouseX) * (this.x - MouseX) + (this.y - MouseY) * (this.y - MouseY)) < this.size * 0.35) {
            this.touchM = this.touchM + 1
            if (this.state == 0 || this.state == 1) {
                this.img.src = IMG_URL + "pet_walk.gif"
                this.state = 2
                this.timer = 22
                this.distance = 0
                return
            }
            if (this.touchM > 36) {
                this.touchM = 0
                if (this.state == 4 || this.state == 5) return
                this.state = 4
                this.img.src = IMG_URL + "pet_walk.gif"
                this.timer = 5
            } else if (this.touchM > 8) {
                this.distance = 0
            }
        } else {
            this.touchM = this.touchM > 0 ? this.touchM - 1 : 0
            if (this.state == 5) {
                this.state = 0
            }
        }
    }
    draw() {
        this.img.style.left = this.x - this.img.offsetWidth / 2 + 'px';
        this.img.style.top = this.y - this.img.offsetHeight / 2.5 + 'px';
        this.img.style.transform = 'rotate(' + (this.d % 360) + 'deg)'
    }
}

class aFish {
    constructor(x, y, size) {
        const myimg = document.createElement("img");
        myimg.src = IMG_URL + "fish.png"
        myimg.setAttribute("class", "jx06fish");
        document.body.insertBefore(myimg, document.body.firstChild);
        myimg.style.position = 'fixed';
        myimg.style.height = size + "px";
        myimg.style.left = x + "px";
        myimg.style.top = y + "px";
        this.img = myimg
        this.x = x
        this.y = y
        this.d = 0
        this.count = 10
    }
    move() {
        if (this.d == this.count) {
            this.count = this.count * -1
        }
        this.d += this.count > this.d ? 5 : -5
        this.x += (MouseX - this.x) * 0.4
        this.y += (MouseY - this.y) * 0.4
        this.img.style.transform = 'rotate(' + (-90 + this.d) + 'deg)'
        this.img.style.left = this.x - this.img.offsetWidth + 'px';
        this.img.style.top = this.y - this.img.offsetHeight / 2 + 'px';
    }
    eaten() {
        this.img.remove()
        const index = fishes.indexOf(this);
        if (index !== -1) {
            fishes.splice(index, 1);
        }
    }
}
// -----------------------------------------------------------------------
const MyPet = new aPet(...GetRandXY(), 120)
let fishes = []
setInterval(() => {
    MyPet.move()
    MyPet.set()
    MyPet.draw()
    for (const fish of fishes) {
        fish.move()
    }
}, DELAY);

// -----------------------------------------------------------------------
document.addEventListener('mousemove', (event) => {
    MouseX = event.clientX;
    MouseY = event.clientY;
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // console.log(sender.tab ? "from " + sender.tab.url : "from the extension");
        // console.log(request.greeting)
        if (request.greeting = "NewFish") {
            fishes.push(new aFish(MouseX, MouseY, Math.random() * 40 + 50))
        }
        sendResponse({ farewell: "ok" });
    }
);

// -----------------------------------------------------------------------