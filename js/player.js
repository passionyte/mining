import { DEBUG } from "./globals.js"
import { Blocks } from "./blocks.js"

export class Player {
    strength
    inventory
    mined
    money = 0

    constructor(s = 1, i = {}, m = 0) {
        this.strength = s//((DEBUG) && 999) || s
        this.inventory = i
        this.mined = m

        // if (DEBUG) return
        for (const b of Blocks) {
            this.inventory[b[0]] = 0
        }
    }
}

export default { Player }