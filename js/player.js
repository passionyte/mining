import { Blocks } from "./blocks.js"
import { getPickaxe } from "./picks.js"

export class Player {
    strength
    delay
    pickaxe
    inventory
    ownedItems
    mined
    money = 0
    depth = 0
    maxDepth = 100

    constructor(p = "Wood", i = {}, oi = {Wood: true}, m = 0) {
        this.pickaxe = p

        const pdata = getPickaxe(p)

        this.strength = pdata.strength
        this.delay = pdata.delay

        this.inventory = i
        this.ownedItems = oi
        this.mined = m

        for (const b of Blocks) {
            this.inventory[b[0]] = 0
        }
    }
}

export default { Player }