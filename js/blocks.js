import { newSound } from "./sounds.js"

export class Block {
    // properties
    name
    strength
    hp
    value
    rarity
    depth

    // style
    color
    texture
    sound

    constructor(n, s, v, r, d, style) {
        this.name = n
        this.strength = s
        this.hp = s
        this.value = v
        this.rarity = r
        this.depth = d

        for (const i in style) {
            this[i] = style[i]
        }
    }
}

export const Blocks = [ // First = strength, Second = value, Third = rarity, Fourth = depth
    ["Dirt", 8, 1, -1, 0, {color: "rgb(92, 64, 51)", sound: "dirt.ogg"}],
    ["Clay", 10, 2, 4, 2, {color: "rgb(185, 163, 152)", sound: "dirt.ogg"}],
    ["Stone", 12, 4, 6, 10, {color: "rgb(120, 120, 120)"}],
    ["Copper", 16, 9, 8, 15, {color: "rgb(150, 100, 21)"}],
    ["Steel", 20, 12, 10, 25, {color: "rgb(171, 171, 171)"}],
    ["Gold", 18, 16, 12, 50, {color: "rgb(255, 201, 85)"}],
    ["Sapphire", 24, 22, 16, 75, {color: "rgb(50, 81, 255)"}],
    ["Ruby", 28, 26, 20, 100, {color: "rgb(172, 24, 24)"}],
    ["Emerald", 30, 30, 24, 150, {color: "rgb(24, 172, 44)"}],
    ["Diamond", 40, 45, 32, 200, {color: "rgb(35, 181, 218)"}],
    ["Uranium", 34, 64, 50, 250, {color: "rgb(17, 240, 9)"}],
    ["Amethyst", 45, 96, 75, 325, {color: "rgb(186, 9, 240)"}],
    ["Platinum", 50, 200, 100, 400, {color: "rgb(225, 225, 225)"}],
    ["Tektite", 60, 333, 200, 500, {color: "rgb(40, 30, 30)"}],
    ["Adurite", 80, 1500, 500, 650, {color: "rgb(120, 0, 0)"}],
    ["Viridian", 100, 4000, 2000, 800, {color: "rgb(0, 120, 0)"}],
    ["Fire crystal", 200, 20000, 14000, 1000, {color: "rgb(246, 172, 13)"}]
]

newSound(true, "generic.ogg")
for (const a of Blocks) {
    const s = a[5].sound

    if (s) newSound(true, s)
}

export function readBlock(b) {
    const [n, s, v, r, d, style] = b

    return new Block(n, s, v, r, d, style)
}

export function getBlock(nm) {
    let result

    for (let b of Blocks) {
        b = readBlock(b)

        if (b.name == nm) {
            result = b
            break
        }
    }

    return result
}

export default { Block }