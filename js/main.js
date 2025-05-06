import { CANVAS, CTX, ImageMemory, clearCanvas, MS_PER_FRAME, randInt, newImg, d, DEBUG } from "./globals.js"
import { Blocks, getBlock, readBlock } from "./blocks.js"
import { Player } from "./player.js"

// Inventory
const InvUI = d("inventory")
const InvSlot = d("slotdummy")
const InvMined = d("minedcounter")

// Refinery
const RefUI = d("refinery")
const RefSlot = d("refslotdummy")
const RefMoney = d("moneycounter")
const SellAll = d("sellall")

const w = CANVAS.width
const h = CANVAS.width

const cenX = (w / 2)
const cenY = (h / 2)

const PLR = new Player()
globalThis.PLR = PLR

let NOW = performance.now()
let frame_time = NOW

let curBlock = readBlock(Blocks[0])
let Target
let hitInterval
let Cancel = false

const Cracks = {
    [100]: {x: 0, y: 0},
    [80]: {x: 320, y: 0},
    [60]: {x: 0, y: 320},
    [40]: {x: 320, y: 320},
    [20]: {x: 0, y: 640},
    [0]: {x: 320, y: 640}
}
const Crack = newImg("cracks.png")
let crackBounds

function totalValue() {
    let result = 0

    for (const b in PLR.inventory) {
        result += PLR.inventory[b]
    }

    return result
}

function refresh() {
    drawInv()
    drawInv(RefUI, RefSlot, RefMoney)
    SellAll.innerText = `Sell All for $${totalValue()}`
}

function loadData() {
    if (DEBUG) localStorage.removeItem("Mining_Data"); return

    // how is this unreachable LOL
    let data = localStorage.getItem("Mining_Data")

    if (data) {
        data = JSON.parse(data)

        for (const i in data) PLR[i] = data[i]

        // add missing stuff
        for (const b in Blocks) {
            if (!PLR.inventory[b.name]) PLR.inventory[b.name] = 0
        }
    }
}
loadData()

function saveData() {
    const data = {}

    for (const i in PLR) data[i] = PLR[i]
    localStorage.setItem("Mining_Data", JSON.stringify(data))
}

function drawInv(container = InvUI, dummy = InvSlot, accessory = InvMined) {
    container.innerHTML = null

    for (const b in PLR.inventory) {
        const v = PLR.inventory[b]

        if (v > 0) {
            const slot = dummy.cloneNode(true)

            slot.id = b
    
            const nm = slot.querySelector(".name")
    
            nm.innerHTML = b + ":"

            const data = getBlock(b)

            nm.style.color = ((data) && data.color) || "rgb(100, 100, 100)"
            slot.querySelector(".amount").innerHTML = v
    
            slot.style.display = "block"

            if (container === RefUI) {
                const button = slot.querySelector("#sell")

                const total = (data.value * v)
                button.innerText = `Sell ${v} ${b} for $${total}`
                button.addEventListener("mousedown", function() {
                    PLR.inventory[b] = 0
                    PLR.money += total
                    
                    refresh()
                })
            }

            container.appendChild(slot)
        }
    }

    if (accessory === InvMined) {
         accessory.innerHTML = `Blocks mined: ${PLR.mined}`
    }
    else if (accessory === RefMoney) {
        accessory.innerHTML = `You have: $${PLR.money}`
    }
}

function drawTop(text, color) {
    CTX.fillStyle = "rgba(0, 0, 0, 0.75)"
    CTX.beginPath()
    CTX.roundRect((cenX - 100), (cenY - 240), 200, 50, (Math.PI * 10))
    CTX.fill()

    CTX.font = "40px Courier New"
    CTX.textAlign = "center"
    CTX.fillStyle = color || "white"
    CTX.fillText(text, cenX, (cenY - 200), 400)
}

function hit() {
    Target.hp -= PLR.strength

    if (Cancel || (Target.hp <= 0)) {
        if (Cancel) {
            Target.hp = Target.strength
        }
        else {
            PLR.inventory[Target.name]++
            PLR.mined++

            refresh()
            saveData() // comment out later

            curBlock = readBlock(randBlock())
        }

        crackBounds = null
        Target = null
        clearInterval(hitInterval)
    }
}

function randBlock() {
    let result = Blocks[0] // Dirt

    for (const b of Blocks) {
        const r = b[3]
        if (r != -1 && randInt(1, r) == 1) {
            result = b
            break
        }
    }

    return result
}

function mineBlock() {
    if (!Target && curBlock) {
        Target = curBlock

        hitInterval = setInterval(hit, (((DEBUG) && 1) || 500))
    }
}

function drawBlock(nm) {
    const data = ((nm.name) && nm) || getBlock(nm)

    if (data) {
        clearCanvas()
        const t = data.texture
        const c = data.color || "rgb(100, 100, 100)"

        if (t) {
            CTX.drawImage(ImageMemory[t.src], 0, 0, t.w, t.h, 0, 0, w, h)
        }
        else {
            CTX.fillStyle = c
            CTX.fillRect(0, 0, w, h)
        }

        // Cracks

        let p = 0
        if (Target) {
            p = Math.round(((1 - (Target.hp / Target.strength)) * 100))

            let last = 0
            for (const x in Cracks) {
                if (last) {
                    if (x > p && last < p) {
                        crackBounds = Cracks[x]
                        break
                    }
                }

                last = x
            }
            last = null

            if (!crackBounds) return

            CTX.drawImage(Crack, crackBounds.x, crackBounds.y, 320, 320, 0, 0, w, h)
        }

        // Top Text
        drawTop(data.name, c)

        // Mining Progress
        if (Target) {
            CTX.fillStyle = "rgba(0, 0, 0, 0.75)"
            CTX.beginPath()
            CTX.roundRect((cenX - 225), (cenY + 240), 450, 50, (Math.PI * 10))
            CTX.fill()

            CTX.font = "40px Courier New"
            CTX.textAlign = "center"
            CTX.fillStyle =  c
            CTX.fillText(`Mining ${Target.name}... ${p}%`, cenX, (cenY + 275), 400)
        }

        if (!curBlock) curBlock = data
    }
}

function step() {
    requestAnimationFrame(step)

    /*** Desired FPS Trap ***/
    NOW = performance.now()
    const TIME_PASSED = NOW - frame_time
    if (TIME_PASSED < MS_PER_FRAME) return
    const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
    frame_time = NOW - EXCESS_TIME
    /*** END FPS Trap ***/

    drawBlock(curBlock)
}
step()
refresh()


// Hardcoded event listeners

CANVAS.addEventListener("mousedown", mineBlock)
SellAll.addEventListener("mousedown", function() {
    const award = totalValue()

    if (award <= 0) return

    if (prompt(`Are you sure you want to Sell All for ${award}?`)) {
        for (const b in PLR.inventory) {
            PLR.inventory[b] = 0
        }
    
        PLR.money += award
    }
})