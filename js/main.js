import { CANVAS, CTX, ImageMemory, clearCanvas, MS_PER_FRAME, randInt, newImg } from "./globals.js"
import { Block, Blocks, getBlock } from "./blocks.js"
import { Player } from "./player.js"

const w = CANVAS.width
const h = CANVAS.width

const cenX = (w / 2)
const cenY = (h / 2)

const PLR = new Player()
globalThis.PLR = PLR

for (const b of Blocks) {
    PLR.inventory[b[0]] = 0
}

let NOW = performance.now()
let frame_time = NOW

let curBlock = newBlock(Blocks[0])
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
            curBlock = newBlock(randBlock())
        }

        crackBounds = null
        Target = null
        clearInterval(hitInterval)
    }
}

function randBlock() {
    let result = Blocks[0] // Dirt

    for (const b of Blocks) {
        if (b.rarity != -1 && randInt(1, b.rarity) == 1) {
            result = b
            break
        }
    }

    return result
}

function newBlock(raw) {
    const [n, s, v, r, style] = raw

    return new Block(n, s, v, r, style)
}

function mineBlock() {
    if (!Target && curBlock) {
        Target = curBlock

        hitInterval = setInterval(hit, 500)
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
//drawBlock("Dirt")

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

document.addEventListener("mousedown", mineBlock)