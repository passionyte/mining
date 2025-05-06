import { newSound } from "./sounds.js"

export class Block {
    // properties
    name
    strength
    hp
    value
    rarity

    // style
    color
    texture
    sound

    constructor(n, s, v, r, style) {
        this.name = n
        this.strength = s
        this.hp = s
        this.value = v
        this.rarity = r

        for (const i in style) {
            if (i == "sound") {
                this[i] = newSound(style[i])
            }
            else {
                this[i] = style[i]
            }
        }

        if (!this.sound) this.sound = newSound()
    }
}

export const Blocks = [ // First = strength, Second = value, Third = rarity
    ["Dirt", 10, 1, -1, {color: "rgb(92, 64, 51)", sound: "dirt.ogg"}],
    ["Stone", 15, 2, 6, {color: "rgb(120, 120, 120)"}],
    ["Copper", 18, 5, 8, {color: "rgb(150, 100, 21)"}],
    ["Steel", 25, 8, 10, {color: "rgb(171, 171, 171)"}],
    ["Gold", 20, 14, 12, {color: "rgb(255, 201, 85)"}],
    ["Sapphire", 28, 20, 16, {color: "rgb(79, 67, 255)"}],
    ["Ruby", 30, 25, 20, {color: "rgb(172, 24, 24)"}],
    ["Emerald", 32, 30, 24, {color: "rgb(24, 172, 44)"}],
    ["Diamond", 40, 45, 32, {color: "rgb(35, 181, 218)"}],
    ["Uranium", 35, 64, 50, {color: "rgb(17, 240, 9)"}],
    ["Amethyst", 45, 96, 75, {color: "rgb(186, 9, 240)"}],
]

export function readBlock(b) {
    const [n, s, v, r, style] = b

    return new Block(n, s, v, r, style)
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