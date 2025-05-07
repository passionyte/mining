// Passionyte 2025
'use strict'

import { Url } from "./globals.js"

export const Sounds = {}
export const Playing = {}
let pId = 0

export function newSound(store, src = "generic.ogg", v, l) {
    if (!src || (store && Sounds[src])) {
        return
    }

    pId++
    const a = new Audio((src.includes("snds")) && src || Url + "snds/" + src)
    a.ID = (pId)
    a.volume = v || 0.1
    a.loop = (l)
    a.preload = "metadata"

    Playing[a.ID] = false

    if (store) Sounds[src] = a
   
    return a
}

export function playSound(a, n = false) {
    if (n) { // new/non-lingering audio (tends to be unreliable)
        let nw = newSound(false, a.src, a.volume || 0.01, a.loop || false)
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
        if (Playing[a.ID]) {
            a.pause()
            a.currentTime = 0
        }

        a.play()
        Playing[a.ID] = true

        setTimeout(function() {
            Playing[a.ID] = false
        }, (a.duration * 1000))

        while (true) {
            if (a.paused) break
            if (a.played) Playing[a.ID] = false; break
        }
    }
}

export default { newSound }