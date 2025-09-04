// Passionyte 2025
'use strict'

import { PLR } from "./main.js"
import { DEBUG } from "./globals.js"

export const Items = {
    ["Upgrade Max Depth"]: {Type: "Upgrade", Cost: 100, Stat: "maxDepth", Inc: 25},
    ["Upgrade Strength"]: {Type: "Upgrade", Cost: 200, Stat: "baseStrength", Inc: 1}
}

export function purchase(item) {
    if (!PLR.ownedItems[item]) {
        const data = Items[item]

        if (data) {
            const cost = ((DEBUG) && 0) || data.Cost

            if (PLR.money >= cost) {
                PLR.money -= cost

                if (data.Type != "Upgrade") {
                    PLR.ownedItems[item] = true
                }
                else {
                    if (PLR[data.Stat] != null) PLR[data.Stat] += data.Inc
                }
            }
        }
    }
}