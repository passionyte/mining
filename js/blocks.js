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

export const Blocks = [ // First = strength, Second = value, Third = rarity
    ["Dirt", 10, 1, -1, {color: "rgb(92, 64, 51)"}],
    ["Stone", 15, 2, 6, {color: "rgb(120, 120, 120)"}],
    ["Copper", 20, 5, 8, {color: "rgb(150, 100, 21)"}],
    ["Steel", 25, 8, 10, {color: "rgb(171, 171, 171)"}],
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