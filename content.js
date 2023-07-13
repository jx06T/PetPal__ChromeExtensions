const IMG_URL = "https://raw.githubusercontent.com/jx06T/PetPal__ChromeExtensions/main/images/"
// const IMG_URL = "https://raw.githubusercontent.com/jx06T/PetPal__ChromeExtensions/V1.5/images/"
let MouseX = 0;
let MouseY = 0;
let isMouseDown = false;
const DELAY = 100
let testD = 0
let testd = 1
let STATE = {}

function GetRandXY() {
    return [Math.random() * (window.innerWidth - 140) + 70, Math.random() * (window.innerHeight - 160) + 80]
}
function ResetAllPet() {
    for (const Pet of Pets) {
        Pet.ChangeState(5, IMG_URL + "pet_rest.gif", 24, 28)
    }
}

// -----------------------------------------------------------------------
class aPet {
    // 建構函式
    constructor(x, y, size, color = 0, id = null) {
        this.id = id
        this.size = size
        this.color = color
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.d = 90;
        this.speed = 6.5 - (this.size / 130)

        this.destination = [x, y]
        this.distance = 0
        this.timer = Math.random() * 6 + 4
        this.state = 0//0沒事,1遊走,2跟隨,4轉圈,5冷靜,6吃魚,7睡覺,8融化
        this.touchM = 0
        this.food

        const myimg = document.createElement("img");
        myimg.src = IMG_URL + "pet_rest.gif"
        myimg.setAttribute("class", "jx06pet");
        document.body.insertBefore(myimg, document.body.firstChild);
        myimg.style.height = size + "px";
        myimg.style.position = 'fixed';
        myimg.style.left = x + "px";
        myimg.style.top = y + "px";
        myimg.style.filter = "blur(0px) hue-rotate(" + color + "deg)";
        this.img = myimg
    }
    move() {
        if (this.state == 0 || this.state == 5 || this.state == 7 || this.state == 8) {
            if (this.state == 7 && this.touchM > 0) {
                if (isMouseDown) {
                    this.x = MouseX
                    this.y = MouseY
                } else {
                    this.touchM = 0
                }
            }
            this.vx = 0
            this.vy = 0
            this.d = 0
            return
        }
        if (this.state == 6 || this.distance < 0.5 && (this.state == 1 || this.state == 2)) {
            if (this.state == 6) {
                this.speed = 6.5 - (this.size / 130) + 5 * fishes.length
                this.food = fishes[Math.floor(Math.random() * fishes.length)]
                this.destination = [this.food.x, this.food.y]
            } else {
                this.speed = 6.5 - (this.size / 130)
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
            this.d = this.d + this.speed * ((this.touchM / 1.8) + 1)
            return
        }
        this.distance -= this.state == 2 ? 1.4 : this.state == 1 ? 1.1 : 2.1
        this.d = (180 / Math.PI) * (this.vx > 0 ? Math.atan(this.vy / this.vx) : Math.PI + Math.atan(this.vy / this.vx)) + 90 + testD

        this.x += this.vx
        this.y += this.vy

    }
    setSize(s) {
        this.size = s
        this.img.style.height = s + "px";
        if (this.state == 8||LocalityPets.find(item => item.id == this.id)== undefined) {
            return
        }
        if (LocalityPets.find(item => item.id == this.id).size != s) {
            LocalityPets.find(item => item.id == this.id).size = s
            chrome.storage.local.set({ Pets: LocalityPets })
        };
    }
    set() {
        if (fishes.length > 0) {
            if (this.state != 6) {
                this.ChangeState(6, IMG_URL + "pet_walk.gif", 10, 14)
            } else if (this.distance < 0.5 * (this.size / 120)) {
                this.food.eaten()
                this.ChangeState(5, IMG_URL + "pet_rest.gif", 24, 28)
                this.vx = 0
                this.vy = 0
                this.setSize(parseInt(this.img.style.height) + 15)
                ResetAllPet()
            }
        }
        this.timer -= DELAY / 1000
        if (this.timer < 0) {
            if (this.state == 8) {
                this.img.remove()
                Pets = Pets.filter((item) => {
                    return item !== this;
                });
                LocalityPets = LocalityPets.filter((item) => {
                    return item.id !== this.id;
                });
                chrome.storage.local.set({ Pets: LocalityPets })
                return
            }
            if (this.state == 0) {
                this.ChangeState(1, IMG_URL + "pet_walk.gif", 6, 9)
            } else if (this.state == 4 || this.state == 1 || this.state == 2) {
                this.timer = this.state == 4 ? 18 : this.state == 1 ? 7 : 10
                this.ChangeState(this.state == 4 ? 5 : 0, IMG_URL + "pet_rest.gif", null)
            }
        }
        if (this.state == 8) return

        if (!isSharp)
            this.img.classList.remove("jx06Cpet")
        if (Math.sqrt((this.x - MouseX) * (this.x - MouseX) + (this.y - MouseY) * (this.y - MouseY)) < this.size * 0.4) {
            this.touchM = this.touchM + 1
            if (isSharp && isMouseDown) {
                if (this.size < 130) {
                    this.state = 8
                    this.ChangeState(8, IMG_URL + "pet_melt.gif", 0.9, 0.9, 0)
                } else {
                    this.ChangeState(5)
                    this.setSize(parseInt(this.img.style.height) - 5)
                }
            }
            if (this.state == 0 || this.state == 1) {
                this.ChangeState(2, IMG_URL + "pet_walk.gif", 20, 24, 0)
                return
            }
            if (this.touchM > 36) {
                this.touchM = 0
                if (this.state == 4 || this.state == 5 || this.state == 7) return
                this.ChangeState(4, IMG_URL + "pet_walk.gif", 3, 7)
            } else if (this.touchM > 8) {
                this.distance = 0
            }
        } else {
            this.touchM = this.touchM > 0 ? this.touchM - 1 : 0
            if (this.state == 5) {
                this.ChangeState(0, IMG_URL + "pet_rest.gif", 7, 14)
            }
        }
    }
    draw() {
        this.img.style.left = this.x - this.img.offsetWidth / 2 + 'px';
        this.img.style.top = this.y - this.img.offsetHeight / 2.5 + 'px';
        this.img.style.transform = 'rotate(' + (this.d % 360) + 'deg)'
    }
    ChangeState(state, img = null, timer1 = 8, timer2 = 11, distance = null) {
        this.state = state
        if (img) this.img.src = img
        this.timer = timer1 ? Math.random() * (timer2 - timer1) + timer1 : this.timer
        this.distance = distance || distance === 0 ? distance : this.distance
    }
    updateSkin(data) {
        // const NewSkin = data.filter(item => item.id == this.id);
        const NewSkin = data.find(item => item.id == this.id);
        if (NewSkin == undefined) {
            this.img.remove()
            Pets = Pets.filter((item) => {
                return item !== this;
            });
            return
        }
        if (this.size != NewSkin.size) {
            this.setSize(NewSkin.size)
        }
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
        this.x += (MouseX - this.x) * 0.45
        this.y += (MouseY - this.y) * 0.45
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
let fishes = []
let Pets = []
let LocalityPets = []
async function initialPet(count = 0) {
    const result = await chrome.storage.local.get(["isDeactivate"])
    if (result.isDeactivate) {
        if (Pets.length > 0) {
            for (const Pet of Pets) {
                Pet.img.remove()
            }
            Pets = []
            LocalityPets = []
        }
        return true
    }
    const resultP = await chrome.storage.local.get(["Pets"])
    if (JSON.stringify(LocalityPets) == JSON.stringify(resultP.Pets)) return
    for (const P of resultP.Pets) {
        if (LocalityPets.find(item => item.id == P.id) == undefined) {
            Pets.push(new aPet(...GetRandXY(), Number(P.size), Number(P.color), P.id))
        }
    }
    LocalityPets = resultP.Pets
    for (const Pet of Pets) {
        Pet.updateSkin(resultP.Pets)
    }

    if (count == 1) {
        const result = await chrome.storage.local.get(["invisible"])
        ChangeSTATE({ sleeping: false, invisible: result.invisible })
    }
}
// -----------------------------------------------------------------------
let styleElement = document.createElement('style');
let isSharp = false
styleElement.textContent = '*{cursor: url("https://raw.githubusercontent.com/jx06T/PetPal__ChromeExtensions/main/images/Sharp.png"), grab!important;'
function Sharp() {
    if (!isSharp) {
        // document.body.classList.add("jx06Cbody")
        document.head.appendChild(styleElement);
        isSharp = true
    } else {
        document.head.removeChild(styleElement);
        // document.body.classList.remove("jx06Cbody")
        isSharp = false
    }
}
// -----------------------------------------------------------------------

initialPet(1)
let LastTimestamp = 0
function step(timestamp) {
    if (timestamp - LastTimestamp > 50) {
        testD += testd
        if (testD > 14) testd = -3
        if (testD < -14) testd = 3
        for (const fish of fishes) {
            fish.move()
        }
        for (const Pet of Pets) {
            Pet.move()
            Pet.set()
            Pet.draw()
        }
        LastTimestamp = timestamp
    }
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

// -----------------------------------------------------------------------
function newPet(data) {
    chrome.storage.local.get(["Pets"]).then(NPets => {
        LocalityPets = NPets.Pets
    })
    Pets.push(new aPet(...GetRandXY(), Number(data.size), Number(data.color), data.id))
}

function ChangeSTATE(data) {
    if (STATE != data) {
        console.log("data", data)
        if (data.sleeping == null) {
            data.sleeping = STATE.sleeping
        }
        STATE = data
        if (STATE.invisible) {
            console.log(Pets)
            for (const Pet of Pets) {
                console.log("!!!")
                Pet.img.classList.add("jx06invisible");
            }
        } else {
            for (const Pet of Pets) {
                Pet.img.classList.remove("jx06invisible");
            }
        }
        for (const Pet of Pets) {
            Pet.ChangeState(STATE.sleeping ? 7 : 1, IMG_URL + "pet_rest.gif", 8, 11, 0)
            Pet.img.style.filter = "blur(0px) hue-rotate(" + Pet.color + "deg) brightness(" + (STATE.sleeping ? 95 : 100) + "%)"
        }
    }
}
document.addEventListener('mousemove', (event) => {
    MouseX = event.clientX;
    MouseY = event.clientY;
});
document.addEventListener('mousedown', function (event) {
    isMouseDown = true;
});

document.addEventListener('mouseup', function (event) {
    isMouseDown = false;
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // console.log(request)
        // console.log(sender.tab ? "from " + sender.tab.url : "from the extension");
        // console.log(request.greeting)
        g = request.greeting
        switch (g) {
            case "NewFish":
                fishes.push(new aFish(MouseX, MouseY, Math.random() * 40 + 50))
                break
            case "NewPet":
                newPet(request.data)
                break
            case "GetSTATE":
                sendResponse(STATE);
                return
            case "ChangeSTATE":
                ChangeSTATE(request.data)
                break
            case "isDeactivate":
                initialPet()
                break
            case "Sharp":
                Sharp()
                break
        }
        sendResponse({ ok: "ok" });
    }
);

window.addEventListener('focus', () => {
    if (document.visibilityState === 'visible') {
        initialPet()
    }
})
// -----------------------------------------------------------------------1

