import { config, difficulty, isEmbedded } from './config.js';
import { gameState, lastPostValues, getEl, getSel } from './state.js';

// --- Mise à jour du HUD (Barres de vie, boost, etc.) ---

export function updateHealthUI() {
    const pct = Math.floor((gameState.playerHealth / config.maxHealth) * 100);
    if (lastPostValues.health === pct) return;
    lastPostValues.health = pct;

    const healthBar = getEl('timer');
    const healthTxt = getEl('health-value');
    if (healthBar) {
        healthBar.style.width      = pct + '%';
        healthBar.style.background = pct > 60 ? '#00ffff' : pct > 30 ? '#ffaa00' : '#ff0033';
    }
    if (healthTxt) healthTxt.textContent = pct;
    if (isEmbedded) window.parent.postMessage({ type: 'game_health', percent: pct }, '*');
}

export function updateBoostUI(currentTime) {
    const elapsed = currentTime - gameState.boostUsedAt;
    let pct, statusText, statusColor, statusId;

    if (gameState.boostActive) {
        pct = Math.max(0, 100 - ((currentTime - gameState.boostStartedAt) / config.boostDuration) * 100);
        statusText = 'ACTIF!'; statusColor = '#ff0055'; statusId = 'active';
    } else if (gameState.boostReady) {
        pct = 100;
        statusText = 'PRÊT (SHIFT)'; statusColor = '#00ff00'; statusId = 'ready';
    } else {
        pct = Math.min(100, (elapsed / config.boostCooldown) * 100);
        statusText = 'CHARGEMENT...'; statusColor = '#00ffff'; statusId = 'charging';
    }

    const roundedPct = Math.round(pct);
    
    if (isEmbedded && (lastPostValues.boostStatus !== statusId || Math.abs(lastPostValues.boostPct - roundedPct) > 2)) {
        window.parent.postMessage({ type: 'game_boost', status: statusId, percent: roundedPct }, '*');
        lastPostValues.boostStatus = statusId;
        lastPostValues.boostPct    = roundedPct;
    }

    const needUIUpdate = (lastPostValues.boostStatus !== statusId) || (lastPostValues.boostPct !== roundedPct);
    if (needUIUpdate) {
        lastPostValues.boostStatus = statusId;
        lastPostValues.boostPct    = roundedPct;
        const boostBar    = getEl('boost-bar');
        const boostStatus = getEl('boost-status');
        if (boostBar)    { boostBar.style.width = roundedPct + '%'; boostBar.style.background = statusColor; }
        if (boostStatus) { boostStatus.textContent = statusText; boostStatus.style.color = statusColor; }
    }
}

export function updateSpeedUI() {
    const kmh = Math.round((gameState.currentSpeed || 0) * 80);
    if (lastPostValues.speed === kmh) return;
    lastPostValues.speed = kmh;
    const el = getEl('hud-speed-text');
    if (el) el.textContent = kmh + ' km/h';
    if (isEmbedded) window.parent.postMessage({ type: 'game_speed', speed: kmh }, '*');
}

export function updateRaceProgressUI(percent) {
    const rounded = Math.round(percent);
    if (lastPostValues.progress !== rounded) {
        lastPostValues.progress = rounded;
        const bar  = getEl('hud-progress-bar');
        const text = getEl('hud-progress-text');
        if (bar)  bar.style.width  = rounded + '%';
        if (text) text.textContent = rounded + '%';
        if (isEmbedded) window.parent.postMessage({ type: 'race_progress', percent: rounded }, '*');
    }
    const itemPct  = Math.min(100, Math.round((gameState.itemsCollected / config.itemCount) * 100));
    const needItemsUpdate = lastPostValues.itemsPct !== itemPct || lastPostValues.itemsCollected !== gameState.itemsCollected;
    if (needItemsUpdate) {
        lastPostValues.itemsPct = itemPct;
        lastPostValues.itemsCollected = gameState.itemsCollected;
        const itemsBar = getEl('hud-items-bar');
        const itemsTxt = getEl('hud-items-text');
        if (itemsBar) itemsBar.style.width  = itemPct + '%';
        if (itemsTxt) itemsTxt.textContent  = gameState.itemsCollected + ' / ' + config.itemCount;
    }
}

// --- Envoi des signaux de fin à React ---

export function showGameOver() {
    if (isEmbedded) {
        window.parent.postMessage({ 
            type: 'game_over', 
            difficulty, 
            collected: gameState.itemsCollected, 
            total: config.itemCount 
        }, '*');
    }
}

export function showVictory() {
    const pct = Math.round((gameState.itemsCollected / config.itemCount) * 100);
    if (isEmbedded) {
        window.parent.postMessage({
            type: 'game_victory', 
            difficulty,
            collected: gameState.itemsCollected, 
            total: config.itemCount,
            itemsPercent: pct, 
            eligibleNextLevel: pct >= 70,
        }, '*');
    }
}