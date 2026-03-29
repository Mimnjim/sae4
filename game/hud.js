import { config, isEmbedded } from './config.js';
import { gameContainer } from './scene.js';

export let nextLevelButton = null;

function createProgressBar({ label, barId, textId, color, initial, topMargin = '0px' }) {
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = topMargin;

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size:12px;margin-bottom:6px;';
    wrapper.appendChild(labelEl);

    const track = document.createElement('div');
    track.style.cssText = 'width:200px;height:10px;background:#333;border-radius:6px;overflow:hidden;';

    const bar = document.createElement('div');
    bar.id = barId;
    bar.style.cssText = `height:100%;width:0%;background:${color};transition:width 200ms linear;`;
    track.appendChild(bar);
    wrapper.appendChild(track);

    const text = document.createElement('div');
    text.id = textId;
    text.style.cssText = 'font-size:12px;margin-top:6px;';
    text.textContent = initial;
    wrapper.appendChild(text);

    return wrapper;
}

export function createHUD() {
    if (isEmbedded) return;

    const hud = document.createElement('div');
    hud.id = 'in-game-hud';
    hud.style.cssText = 'position:absolute;left:12px;bottom:12px;z-index:9999;font-family:sans-serif;color:#fff;pointer-events:none;';

    const panel = document.createElement('div');
    panel.style.cssText = 'width:220px;background:rgba(0,0,0,0.5);padding:6px;border-radius:6px;pointer-events:auto;';

    panel.appendChild(createProgressBar({ label: 'Progression', barId: 'hud-progress-bar', textId: 'hud-progress-text', color: '#00ffcc', initial: '0%' }));
    panel.appendChild(createProgressBar({ label: 'Objets',      barId: 'hud-items-bar',    textId: 'hud-items-text',    color: '#ffd54f', initial: `0 / ${config.itemCount}`, topMargin: '10px' }));

    const btn = document.createElement('button');
    btn.id = 'next-level-btn';
    btn.textContent = 'Niveau suivant';
    btn.disabled = true;
    btn.style.cssText = 'margin-top:8px;padding:6px 10px;border-radius:6px;border:none;background:#777;color:#fff;cursor:pointer;pointer-events:auto;';
    btn.addEventListener('click', () => {
        if (!btn.disabled && isEmbedded) window.parent.postMessage({ type: 'next_level' }, '*');
    });
    nextLevelButton = btn;
    panel.appendChild(btn);

    const speedWrapper = document.createElement('div');
    speedWrapper.style.marginTop = '8px';
    const speedLabel = document.createElement('div');
    speedLabel.textContent = 'Vitesse';
    speedLabel.style.cssText = 'font-size:12px;margin-bottom:6px;';
    const speedText = document.createElement('div');
    speedText.id = 'hud-speed-text';
    speedText.style.cssText = 'font-size:14px;font-weight:bold;';
    speedText.textContent = '0 km/h';
    speedWrapper.appendChild(speedLabel);
    speedWrapper.appendChild(speedText);
    panel.appendChild(speedWrapper);

    hud.appendChild(panel);
    if (gameContainer) {
        gameContainer.style.position = gameContainer.style.position || 'relative';
        gameContainer.appendChild(hud);
    } else {
        document.body.appendChild(hud);
    }
}

export function initEmbeddedUI() {
    if (!isEmbedded) return;
    document.body.classList.add('embedded');
    ['boost-panel', 'items-panel'].forEach(cls => {
        const el = document.querySelector('.' + cls);
        if (el) el.style.display = 'none';
    });
    const timerBar = document.getElementById('container-timer');
    if (timerBar) timerBar.style.display = 'none';
}
