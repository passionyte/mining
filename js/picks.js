// Passionyte 2025
'use strict'

export class Pickaxe {
    name
    strength
    delay
    tier
    cost
    img

    constructor(n, s, d, c, t, img) {
        this.name = n
        this.strength = s
        this.delay = d
        this.tier = t
        this.cost = c
        this.img = img
    }
}

export const Pickaxes = [ // First number = strength (damage per hit), second number = delay (ms), third number = cost to purchase
    new Pickaxe("Wood", 1, 1000, 0, "Common", "pick_starter.png"),
    new Pickaxe("Stone", 2, 900, 100, "Common", "pick_stone.png"),
    new Pickaxe("Copper", 2.5, 700, 500, "Common", "pick_copper.png"),
    new Pickaxe("Steel", 4, 800, 1000, "Common", "pick_steel.png"),
    new Pickaxe("Gold", 3, 400, 2000, "Rare", "pick_gold.png"),
    new Pickaxe("Ruby", 6, 600, 4000, "Rare", "pick_ruby.png"),
    new Pickaxe("Emerald", 11, 1500, 6000, "Rare", "pick_emerald.png"),
    new Pickaxe("Diamond", 7, 550, 8000, "Rare", "pick_diamond.png"),
    new Pickaxe("Adurite", 9, 500, 12000, "Epic", "pick_adurite.png"),
    new Pickaxe("Viridian", 11, 450, 20000, "Epic", "pick_viridian.png"),
    new Pickaxe("Fire crystal", 14, 330, 40000, "Legendary", "pick_firecrystal.png"),
]

export function getPickaxe(n) {
    let result

    for (const p of Pickaxes) {
        if (p.name == n) {
            result = p
            break
        }
    }

    return result
}

export default { Pickaxes }