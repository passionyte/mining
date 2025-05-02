export class Player {
    strength
    inventory
    mined

    constructor(s = 1, i = {}, m = 0) {
        this.strength = s
        this.inventory = i
        this.mined = m
    }
}

export default { Player }