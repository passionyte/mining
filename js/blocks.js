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
            this[i] = style[i]
        }
    }
}

export const Blocks = [
    ["Dirt", 10, 1, -1, {color: "rgb(92, 64, 51)"}],
    ["Stone", 15, 2, 4, {color: "rgb(140, 140, 140)"}],
]

export function getBlock(nm) {
    let result

    for (const b of Blocks) {
        if (b.name == nm) {
            result = b
            break
        }
    }

    return result
}

export default { Block }