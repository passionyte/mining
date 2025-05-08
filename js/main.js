// Passionyte 2025
'use strict'

import { CANVAS, CTX, ImageMemory, clearCanvas, MS_PER_FRAME, randInt, newImg, d, DEBUG, Url, clamp, sanify } from "./globals.js"
import { Blocks, getBlock, newBlock, layerFromDepth, Tiers } from "./blocks.js"
import { Player } from "./player.js"
import { playSound, newSound, Sounds } from "./sounds.js"
import { Pickaxes, getPickaxe } from "./picks.js"
import { Items, purchase } from "./shop.js"

// Inventory
const InvUI = d("inventory")
const InvSlot = d("slotdummy")
const InvMined = d("minedcounter")
const CurDepth = d("depthcounter")

// Refinery
const RefUI = d("refinery")
const RefSlot = d("refslotdummy")
const RefMoney = d("moneycounter")
const SellAll = d("sellall")

// Shop
const ShopUI = d("shop")
const ShopSlot = d("shopslotdummy")

// Pickaxe
const PickUI = d("pickdisplay")
const PickStats = d("pickstats")
const PickIcon = d("pickicon")
const PickStrength = PickStats.querySelector("#strength")
const PickDelay = PickStats.querySelector("#delay")
const PrevPick = d("prevpick")
const NextPick = d("nextpick")
const BuyPick = d("buypick")
const EquipPick = d("equippick")

// Depth Selector
const ToMove = d("mover")
const DepthUp = d("up")
const DepthDown = d("dn")

// Variables

const w = CANVAS.width
const h = CANVAS.height

const cenX = (w / 2)
const cenY = (h / 2)

export const PLR = new Player()

let NOW = performance.now()
let frame_time = NOW

let curBlock = newBlock(Blocks[0])
let Target
let hitInterval
let pickViewing = 0
let Cancel = false

// Cracks

const Cracks = {
    [90]: {x: 0, y: 0},
    [80]: {x: 320, y: 0},
    [60]: {x: 0, y: 320},
    [40]: {x: 320, y: 320},
    [20]: {x: 0, y: 640},
    [0]: {x: 320, y: 640}
}
const Crack = newImg("cracks.png")
let crackBounds

// Sound preloads (sounds.js 'handles' preloading on new)
const pop = newSound(true, "pop.ogg")

// Functions

function moveDepth(x) {
    const des = clamp((PLR.depth + x), 0, PLR.minedDepth) // desired depth

    if (des > -1 && (des <= PLR.minedDepth)) { // If player has mined to this depth, then Fine.
        PLR.depth = des
        Cancel = true
        curBlock = newBlock(getBlock(layerFromDepth(PLR.depth).block)) // Gets the current layer block

        saveData()
        refresh()
    }
}

function drawShop() {
    ShopUI.innerHTML = null

    for (const item in Items) {
        const data = Items[item]

        if (data) {
            const n = ShopSlot.cloneNode(true)

            n.id = item

            n.querySelector(".name").innerHTML = item

            const button = n.querySelector("#buy")
            button.innerHTML = `Buy for $${data.Cost}`
            button.addEventListener("mousedown", function() {
                purchase(item)
                refresh()
            })

            n.style.display = "block"

            ShopUI.appendChild(n)
        }
    }
}

function drawPickaxe(pick) {
    let data

    if (!pick) {
        data = Pickaxes[pickViewing]
    }
    else { // assuming 'pick' is a string
        data = getPickaxe(pick)
    }

    if (data) { // Let's handle the pickaxe gui!
        if (!pick) pick = data.name

        const title = PickUI.querySelector("#pickname")

        title.innerHTML = `${pick} Pickaxe`

        const tier = PickUI.querySelector("#picktier")
        const t = data.tier || "Common"

        tier.innerHTML = t
        tier.style.color = Tiers[t]

        PickIcon.style.backgroundImage = `url(${Url + "imgs/" + data.img})`

        const equipped = (PLR.pickaxe == pick)
        const owned = (PLR.ownedItems[pick])

        // A bunch of stuff like buttons that needs to appear or disappear
        PickIcon.querySelector("#equipped").style.display = ((equipped && "inline-block") || "none")
        EquipPick.style.display = (((owned && !equipped) && "inline-block") || "none")
        BuyPick.style.display = (((!owned) && "inline-block") || "none")
        BuyPick.innerText = `Buy for $${data.cost}`

        // Pickaxe attributes
        PickStrength.querySelector("#val").innerHTML = data.strength
        PickDelay.querySelector("#val").innerHTML = `${(Math.floor((data.delay / 1000) * 100) / 100)}s`
    }
}

function equipPickaxe(pick) {
    if (PLR.ownedItems[pick.name]) {
        Cancel = true
        PLR.pickaxe = pick.name
        PLR.strength = pick.strength
        PLR.delay = pick.delay
        
        saveData()
    }
}

function totalValue() {
    let result = 0

    for (const b in PLR.inventory) {
        const data = getBlock(b)

        if (data) result += (PLR.inventory[b] * data.value || 0)
    }

    return result
}

function refresh() {
    drawInv()
    drawInv(RefUI, RefSlot, RefMoney)
    drawShop()

    CurDepth.innerText = `Current depth: ${PLR.depth} / ${PLR.minedDepth} / ${PLR.maxDepth}`
    SellAll.innerText = `Sell All for $${totalValue()}`
}

function loadData() {
    let data = localStorage.getItem("Mining_Data")

    if (data) {
        data = JSON.parse(data)

        for (const i in data) PLR[i] = data[i]

        curBlock = newBlock(getBlock(layerFromDepth(PLR.depth).block)) // Gets the current layer block
    }

    // re-sort blocks
    const n = {}
    for (const b of Blocks) {
        const v = PLR.inventory[b.name]

        n[b.name] = ((typeof(v) == "number") && v) || 0
    }
    PLR.inventory = n

    refresh()
}
loadData()

function saveData() {
    const data = {}

    for (const i in PLR) data[i] = PLR[i]
    localStorage.setItem("Mining_Data", JSON.stringify(data))
}

function drawInv(container = InvUI, dummy = InvSlot, accessory = InvMined) { // Handles both inventory and (optionally) refinery or whatever block list is in this style
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

            const tier = data.tier || "Common"
            slot.style.backgroundColor = Tiers[tier]

            if (container === RefUI) {
                const button = slot.querySelector("#sell")

                const total = (data.value * v)
                button.innerText = `Sell ${v} ${b} for $${total}`
                button.addEventListener("mousedown", function() {
                    PLR.inventory[b] = 0
                    PLR.money += total
                    
                    saveData()
                    refresh()
                })
            }

            container.appendChild(slot)
        }
    }

    // not sure why I used 'accessory' as a name but refers to text or some sort of object that is updated on draw
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
    playSound(Sounds[Target.sound || "generic.ogg"], true)
    Target.hp -= (((DEBUG) && Target.hp)) || PLR.strength

    if (Cancel || (Target.hp <= 0)) { // Presumably the mining is done
        if (Cancel) { // Cancel the mining and restore the Block's HP
            Cancel = false
            Target.hp = Target.strength
        }
        else { // Player has mined the block
            playSound(pop)

            if (isNaN(PLR.inventory[Target.name])) PLR.inventory[Target.name] = 0 // Stupid bug
            PLR.inventory[Target.name]++
            PLR.mined++

            if (PLR.minedDepth < PLR.maxDepth) PLR.minedDepth++

            refresh()
            saveData()

            curBlock = newBlock(randBlock())
        }

        crackBounds = null
        Target = null
        clearInterval(hitInterval)
    }
}

function randBlock() {
    let result

    const d = PLR.depth
    const l = layerFromDepth(d)
    const pool = l.getBlocksWithinPool(d) // This magic should pull the blocks discoverable in this layer with considerations to the player's depth

    result = getBlock(l.block) // Layer block

    for (const b of pool) {
        if (randInt(1, b.rarity) == 1) {
            result = b
            break
        }
    }

    return result
}

function mineBlock() {
    if (!Target && curBlock) {
        Target = curBlock
        Cancel = false

        if (DEBUG || (PLR.strength >= Target.strength)) {
            hit()
        }
        else {
            hitInterval = setInterval(hit, PLR.delay)
        }
    }
}

function drawBlock(nm) { // Uses canvas
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
            for (const threshold of Object.keys(Cracks).map(Number).sort((a, b) => b - a)) {
                if (p >= threshold) {
                    crackBounds = Cracks[threshold]
                    break
                }
            }

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

    if (DEBUG) {
        if (globalThis.curBlock) curBlock = getBlock(globalThis.curBlock)
        globalThis.PLR = PLR
    }
}
step()
refresh()
drawPickaxe()


// Hardcoded event listeners

CANVAS.addEventListener("mousedown", mineBlock)
SellAll.addEventListener("mousedown", function() {
    const award = totalValue()

    if (award <= 0) return

    if (confirm(`Are you sure you want to Sell All for $${award}?`)) {
        for (const b in PLR.inventory) {
            PLR.inventory[b] = 0
        }
    
        PLR.money += award

        saveData()
        refresh()
    }
})
PrevPick.addEventListener("mousedown", function() {
    if (pickViewing > 0) pickViewing--
    drawPickaxe()
})
NextPick.addEventListener("mousedown", function() {
    if (pickViewing < (Pickaxes.length - 1)) pickViewing++
    drawPickaxe()
})
EquipPick.addEventListener("mousedown", function() {
    equipPickaxe(Pickaxes[pickViewing])
    drawPickaxe()
})
BuyPick.addEventListener("mousedown", function() {
    const data = Pickaxes[pickViewing]

    if (data) {
        if (!PLR.ownedItems[data.name]) {
            const cost = data.cost

            if (PLR.money >= cost) {
                PLR.money -= cost
                PLR.ownedItems[data.name] = true

                equipPickaxe(data)
                refresh()
                drawPickaxe()
            }
        }
    }
})
DepthDown.addEventListener("mousedown", function() {
    moveDepth(sanify(ToMove.value) || 25)
})
DepthUp.addEventListener("mousedown", function() {
    moveDepth(-sanify(ToMove.value) || -25)
})

export default { PLR }