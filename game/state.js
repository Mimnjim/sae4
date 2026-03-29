import { config } from './config.js';

export const gameState = {
    keysPressed:    {},
    playerHealth:   config.playerHealth,
    itemsCollected: 0,
    hasWon:         false,
    isReady:        false,
    boostReady:     false,
    boostActive:    false,
    boostUsedAt:    Date.now() - config.boostCooldown,
    boostStartedAt: 0,
    currentSpeed:   0,
};

// Anti-spam PostMessage : on ne réémet que si la valeur change
export const lastPostValues = { speed: -1, progress: -1, health: -1, boostStatus: null, boostPct: -1, itemsPct: -1, itemsCollected: -1 };

// Cache DOM : évite document.getElementById à chaque frame
const domCache = {};
export function getEl(id)   { return domCache[id]  || (domCache[id]  = document.getElementById(id)); }
export function getSel(sel) { return domCache[sel] || (domCache[sel] = document.querySelector(sel)); }

// Référence partagée au joueur (évite les imports circulaires)
export const playerRef = { bike: null };
