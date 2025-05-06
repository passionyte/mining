// Passionyte 2025
'use strict'

import { Url } from "./globals.js"

export const Playing = {}
let pId = 0

export function newSound(src = "generic.ogg", v, l) {
    pId++
    const a = new Audio((src.includes("snds")) && src || Url + "snds/" + src)
    a.ID = (pId)
    a.volume = v || 0.1
    a.loop = (l)

    Playing[a.ID] = false

    return a
}

export function playSound(a, n = false) {
    if (Playing[a.ID]) return

    if (n) { // new/non-lingering audio
        let nw = newSound(a.src, a.volume || 0.01, a.loop || false)
        nw.play()

        Playing[nw.ID] = true

        if (nw.loop) return
        setTimeout(function() {
            Playing[nw.ID] = null
            pId--
            nw = null
        }, (nw.duration * 1000))
    }
    else { // lingering audio
        a.play()
        Playing[a.ID] = true

        setTimeout(function() {
            Playing[a.ID] = false
        }, (a.duration * 1000))
    }
}

export default { newSound }