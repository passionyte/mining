import { PLR } from "./main.js"
// import { Pickaxes } from "./picks.js"
import { DEBUG } from "./globals.js"

export const Items = {
    ["Upgrade Max Depth"]: {Type: "Upgrade", Cost: 100, Stat: "maxDepth", Inc: 25}
}

/*for (const p of Pickaxes) {
    if ((p.tier != "Starter" && (p.cost > 0)) || DEBUG) {
        Items[p.name] = {
            Type: "Pickaxe",
            Cost: p.cost
        }
    }
}*/

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
                    const stat = PLR[data.Stat]
                    if (stat) stat += data.Inc
                }
            }
        }
    }
}