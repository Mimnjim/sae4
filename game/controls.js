import { gameState } from './state.js';

const BLOCKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Shift'];

window.addEventListener('keydown', e => {
    if (BLOCKED_KEYS.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
    gameState.keysPressed[e.key] = true;
});

window.addEventListener('keyup', e => {
    if (BLOCKED_KEYS.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
    gameState.keysPressed[e.key] = false;
});
