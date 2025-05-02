import { CANVAS, CTX, ImageMemory, clearCanvas, MS_PER_FRAME } from "./globals.js"
import { Blocks, getBlock } from "./blocks.js"
import { Player } from "./player.js"

const w = CANVAS.width
const h = CANVAS.width

const cenX = (w / 2)
const cenY = (h / 2)

const PLR = new Player()

let NOW = performance.now()
let frame_time = NOW

let curBlock = Blocks[0]
let Target
let lastHit
let hitInterval
let Cancel = false

function drawTop(text, color) {
    CTX.fillStyle = "rgba(0, 0, 0, 0.5)"
    CTX.beginPath()
    CTX.roundRect((cenX - 100), (cenY - 240), 200, 50, (Math.PI * 10))
    CTX.fill()

    CTX.font = "40px Courier New"
    CTX.textAlign = "center"
    CTX.fillStyle = color || "white"
    CTX.fillText(text, cenX, (cenY - 200), 400)
}

function hit() {
    if ((NOW - lastHit) > 1000) {
        lastHit = NOW
        Target.hp -= PLR.strength
        console.log(Target.hp)
    }

    if (Cancel || (Target.hp <= 0)) clearInterval(hitInterval)
}

function mineBlock() {
    if (!Target && curBlock) {
        Target = curBlock

        hitInterval = setInterval(hit, 1000)

        PLR.inventory[Target.name]++
        PLR.mined++

        Target = null
    }
}
globalThis.mine = mineBlock

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

        // Top Text
        drawTop(data.name, c)

        // Mining Progress
        if (Target) {
            CTX.fillStyle = "rgba(0, 0, 0, 0.5)"
            CTX.beginPath()
            CTX.roundRect((cenX - 100), (cenY + 240), 200, 50, (Math.PI * 10))
            CTX.fill()

            CTX.font = "40px Courier New"
            CTX.textAlign = "center"
            CTX.fillStyle = Target.color || "white"
            CTX.fillText(`Mining ${Target.name}... ${Math.floor(((1 - (Target.hp / Target.strength)) * 100))}%`, cenX, (cenY + 200), 400)
        }

        curBlock = data
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

    console.log('hi')

    drawBlock(curBlock)
}
step()