// Passionyte 2025
'use strict'

export const CANVAS = d("CANVAS")
export const CTX = CANVAS.getContext("2d")

export const FPS = 60
export const MS_PER_FRAME = (1000 / FPS)

export const DEBUG = false

const useRaw = (document.URL.includes("passionyte.github.io/mining"))
export const Url = ((!useRaw) && "../") || "https://raw.githubusercontent.com/passionyte/mining/refs/heads/main/"

export function d(id) {
    return document.getElementById(id)
}

export const ImageMemory = {}

export function newImg(src) {
    if (ImageMemory[src]) {
        return ImageMemory[src]
    }

    const i = new Image()
    i.src = (Url + "imgs/") + (((src) && src))

    ImageMemory[src] = i

    return i
}

export function clearCanvas() {
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height)
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}  

export function clamp(x, min, max) {
    if (x < min) x = min

    if (x > max) x = max

    return x
}

export function sanify(x) {
    x = Number(x)

    if (isNaN(x)) return false

    return Math.floor(Math.abs(x))
}

export default { CTX }