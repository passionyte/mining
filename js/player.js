// Passionyte 2025
'use strict'

import { Blocks } from "./blocks.js"
import { DEBUG } from "./globals.js"

export class Player {
    pickaxe
    inventory
    ownedItems
    mined
    money = 0
    depth = 0
    minedDepth = 0
    maxDepth = 100
    baseStrength = 0

    constructor(p = "Wood", i = {}, oi = {Wood: true}, m = 0) {
        this.pickaxe = p

        this.inventory = i
        this.ownedItems = oi
        this.mined = m

        if (DEBUG) return
        for (const b of Blocks) {
            this.inventory[b.name] = 0
        }
    }
}

export default { Player }