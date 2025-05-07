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
    new Pickaxe("Wood", 1, 1000, 0, "Starter", "pick_starter.png"),
    new Pickaxe("Stone", 2, 1000, 100, "Basic", "pick_stone.png"),
    new Pickaxe("Copper", 2.5, 800, 500, "Basic", "pick_copper.png"),
    new Pickaxe("Steel", 4, 900, 1000, "Basic", "pick_steel.png"),
    new Pickaxe("Gold", 3, 450, 2000, "Rare", "pick_gold.png"),
    new Pickaxe("Ruby", 6, 650, 4000, "Rare", "pick_ruby.png"),
    new Pickaxe("Emerald", 11, 1800, 6000, "Rare", "pick_emerald.png"),
    new Pickaxe("Diamond", 7, 600, 8000, "Epic", "pick_diamond.png"),
    new Pickaxe("Adurite", 9, 700, 12000, "Epic", "pick_adurite.png"),
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