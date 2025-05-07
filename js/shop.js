import { PLR } from "./main.js"
import { DEBUG } from "./globals.js"

export const Items = {
    ["Upgrade Max Depth"]: {Type: "Upgrade", Cost: 100, Stat: "maxDepth", Inc: 25}
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
                    if (PLR[data.Stat]) PLR[data.Stat] += data.Inc
                }
            }
        }
    }
}