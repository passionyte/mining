// Passionyte 2025
'use strict'

import { newSound } from "./sounds.js"

class Block {
    // properties
    name
    strength
    hp
    value
    rarity
    minDepth

    // style
    color
    texture
    sound

    constructor(d) {
        for (const i in d) {
            if (i == "style") {
                for (const ix in d.style) {
                    this[ix] = d.style[ix]
                } 
            }
            else {
                this[i] = d[i]
            }
        }

        this.hp = this.strength
    }
}

class Layer {
    // properties
    block
    minDepth
    maxDepth

    isWithin(d) { // checks if a depth is within the layer's range (min/max)
        return anyWithin(d, this.minDepth, this.maxDepth)
    }

    getBlocksWithinPool(d) { // returns a array of block names in the spawn pool for this layer
        const result = []

        for (const b of Blocks) {
            if (b.minDepth) {
                if (this.isWithin(b.minDepth) && (!b.maxDepth || this.isWithin(b.maxDepth)) && (!d || anyWithin(d, b.minDepth, b.maxDepth))) {
                    console.log(`${b.name} added to pool`)
                    result.push(b)
                }
            }
        }

        return result
    }

    constructor(b, min, max) {
        this.block = b
        this.minDepth = min
        this.maxDepth = max
    }
}

export const Blocks = [ 
    /* 
        If a tier is undefined, then it is 'Common'.
        If rarity, minDepth and maxDepth are undefined, then it is assumed the block is a layer block, otherwise no spawning.
        If maxDepth is undefined, then it spawns everywhere after its minDepth.
    */

    {
        name: "Dirt",
        strength: 8,
        value: 1,
        style: {color: "rgb(92, 64, 51)", sound: "dirt.ogg"}
    },
    {
        name: "Clay",
        strength: 10,
        value: 2,
        rarity: 3,
        minDepth: 2,
        maxDepth: 40,
        style: {color: "rgb(185, 163, 152)", sound: "dirt.ogg"}
    },
    {
        name: "Stone",
        strength: 12,
        value: 4,
        style: {color: "rgb(120, 120, 120)"}
    },
    {
        name: "Copper",
        strength: 16,
        value: 10,
        rarity: 6,
        minDepth: 20,
        style: {color: "rgb(150, 100, 21)"}
    },
    {
        name: "Steel",
        strength: 20,
        value: 15,
        rarity: 8,
        minDepth: 41,
        style: {color: "rgb(171, 171, 171)"}
    },
    {
        name: "Gold",
        strength: 18,
        value: 22,
        rarity: 12,
        minDepth: 41,
        style: {color: "rgb(255, 201, 85)"}
    },
    {
        name: "Sapphire",
        strength: 24,
        value: 35,
        rarity: 14,
        minDepth: 60,
        style: {color: "rgb(50, 81, 255)"}
    },
    {
        name: "Ruby",
        strength: 28,
        value: 42,
        rarity: 16,
        minDepth: 100,
        style: {color: "rgb(172, 24, 24)"}
    },
    {
        name: "Amber",
        strength: 15,
        value: 48,
        rarity: 9,
        minDepth: 22,
        maxDepth: 41,
        style: {color: "rgb(177, 122, 5)"}
    },
    {
        name: "Emerald",
        strength: 30,
        value: 55,
        rarity: 20,
        minDepth: 150,
        style: {color: "rgb(24, 172, 44)"}
    },
    {
        name: "Diamond",
        strength: 40,
        value: 70,
        rarity: 25,
        minDepth: 200,
        style: {color: "rgb(35, 181, 218)"}
    },
    {
        name: "Obsidian",
        strength: 60,
        value: 90,
        rarity: 30,
        minDepth: 225,
        style: {color: "rgb(30, 0, 30)"}
    },
    {
        name: "Uranium",
        tier: "Uncommon",
        strength: 34,
        value: 102,
        rarity: 40,
        minDepth: 250,
        style: {color: "rgb(17, 240, 9)"}
    },
    {
        name: "Amethyst",
        tier: "Uncommon",
        strength: 45,
        value: 180,
        rarity: 50,
        minDepth: 300,
        style: {color: "rgb(186, 9, 240)"}
    },
    {
        name: "Titanium",
        tier: "Uncommon",
        strength: 55,
        value: 246,
        rarity: 60,
        minDepth: 350,
        style: {color: "rgb(80, 90, 100)"}
    },
    {
        name: "Platinum",
        tier: "Uncommon",
        strength: 50,
        value: 380,
        rarity: 70,
        minDepth: 400,
        style: {color: "rgb(225, 225, 225)"}
    },
    {
        name: "Tektite",
        tier: "Rare",
        strength: 60,
        value: 666,
        rarity: 85,
        minDepth: 500,
        style: {color: "rgb(40, 30, 30)"}
    },
    {
        name: "Adurite",
        tier: "Rare", 
        strength: 70,
        value: 1500,
        rarity: 100,
        minDepth: 600,
        style: {color: "rgb(120, 0, 0)"}
    },
    {
        name: "Viridian",
        tier: "Epic",
        strength: 100,
        value: 6200,
        rarity: 200,
        minDepth: 800,
        style: {color: "rgb(0, 120, 0)"}
    },
    {
        name: "Fire crystal",
        tier: "Legendary",
        strength: 200,
        value: 24000,
        rarity: 500,
        minDepth: 1000,
        style: {color: "rgb(246, 172, 13)"}
    }
]

export const Layers = [
    /*
        Same rule about depth ranges applies here.
        No layer can co-exist within eachother's range; if that happens, there's trouble!
    */

    new Layer("Dirt", 0, 40),
    new Layer("Stone", 40)
]

export const Tiers = { // Simply just colors
    Common: "rgb(200, 200, 200)",
    Uncommon: "rgb(140, 140, 140)",
    Rare: "rgb(40, 170, 255)",
    Epic: "rgb(155, 2, 226)",
    Legendary: "rgb(220, 220, 50)"
}

newSound(true, "generic.ogg")
for (const a of Blocks) {
    const s = a.style.sound

    if (s) newSound(true, s)
}

export function newBlock(b) {
    return new Block(b)
}

export function getBlock(nm) {
    let result

    for (let b of Blocks) {
        if (b.name == nm) {
            result = newBlock(b)
            break
        }
    }

    return result
}

export function layerFromDepth(d) {
    let layer = Layers[0]

    for (const l of Layers) {
        if (l.isWithin(d)) {
            layer = l
            break
        }
    }

    return layer
}

export function anyWithin(d, min, max) {
    return (d >= min && (!max || (d <= max)))
}

export default { Block }