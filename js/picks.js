// Passionyte 2025
'use strict'

export class Pickaxe {
    name
    power
    delay
    tier
    cost
    img

    constructor(n, s, d, c, t, img) {
        this.name = n
        this.power = s
        this.delay = d
        this.tier = t
        this.cost = c
        this.img = img
    }
}

export const Pickaxes = [ // First number = power (damage per hit), second number = delay before next block (ms), third number = cost to purchase
    new Pickaxe("Wood", 1, 600, 0, "Common", "pick_starter.png"),
    new Pickaxe("Stone", 2, 800, 100, "Common", "pick_stone.png"),
    new Pickaxe("Copper", 3, 550, 500, "Common", "pick_copper.png"),
    new Pickaxe("Steel", 5, 900, 1000, "Common", "pick_steel.png"),
    new Pickaxe("Gold", 2.5, 100, 2000, "Rare", "pick_gold.png"),
    new Pickaxe("Ruby", 6, 500, 4000, "Rare", "pick_ruby.png"),
    new Pickaxe("Emerald", 14, 2000, 6000, "Rare", "pick_emerald.png"),
    new Pickaxe("Diamond", 8, 450, 8000, "Rare", "pick_diamond.png"),
    new Pickaxe("Adurite", 10, 400, 12000, "Epic", "pick_adurite.png"),
    new Pickaxe("Viridian", 13, 350, 20000, "Epic", "pick_viridian.png"),
    new Pickaxe("Fire crystal", 16, 300, 40000, "Legendary", "pick_firecrystal.png"),
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