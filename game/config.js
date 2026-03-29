export const urlParams  = new URLSearchParams(window.location.search);
export const difficulty = parseInt(urlParams.get('difficulty')) || 1;
export const isEmbedded = window.parent && window.parent !== window;

export const config = {
    bikeSpeed:        1.0,
    bikeLateralSpeed: 0.3,
    // default number of enemies (will be overridden per difficulty)
    maxEnemies:       10,
    enemyMoveSpeed:   -0.08,
    playerHealth:     100,
    maxHealth:        100,
    roadLength:       500,
    boostMultiplier:  2.5,
    boostCooldown:    10000,
    boostDuration:    3000,
    itemCount:        6,
        // Global scale multiplier for enemy visuals (use >1 to make enemies larger)
        enemyScaleMultiplier: 1.3,
    // enemy sizing control: base height (world units) and increment per difficulty
    enemyBaseHeight:  6,
    enemyHeightIncrease: 2,
};

switch (difficulty) {
    // Reduce the number of simultaneous enemies for better performance,
    // but we will scale them larger for higher difficulty.
    case 1: Object.assign(config, { bikeSpeed: 1.2, bikeLateralSpeed: 0.5, maxEnemies: 8,  playerHealth: 120, maxHealth: 120, roadLength: 700,  itemCount: 8  }); break;
    case 2: Object.assign(config, { bikeSpeed: 1.8, bikeLateralSpeed: 0.5, maxEnemies: 12, playerHealth: 100, maxHealth: 100, roadLength: 1500, itemCount: 15 }); break;
    case 3: Object.assign(config, { bikeSpeed: 2.5, bikeLateralSpeed: 0.5, maxEnemies: 18, playerHealth: 80,  maxHealth: 80,  roadLength: 3000, itemCount: 25 }); break;
}
