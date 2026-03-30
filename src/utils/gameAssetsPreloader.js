/**
 * Précharge les modèles 3D du jeu en arrière-plan
 * Utilise requestIdleCallback pour ne pas bloquer l'interface
 */

// Modèles nécessaires pour le jeu
const GAME_MODELS = [
    '/game/assets/models/voiture/Voiture.gltf',      // Player bike
    '/game/assets/models/camion/camion.gltf',        // Enemy truck
    '/game/assets/models/main/Main_item.gltf',       // Collectible items
];

export function preloadGameAssets() {
    // Utiliser requestIdleCallback si disponible pour ne pas bloquer
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
            preloadModels();
        }, { timeout: 5000 });
    } else {
        // Fallback: charger après un délai
        setTimeout(() => {
            preloadModels();
        }, 500);
    }
}

function preloadModels() {
    // Importer dynamiquement le loader
    import('./gltfLoader.js').then(({ loadGLTFWithProperPaths }) => {
        // Charger tous les modèles en parallèle
        GAME_MODELS.forEach(modelUrl => {
            loadGLTFWithProperPaths(modelUrl)
                .then(() => {
                    console.log(`✅ Préchargement du modèle réussi: ${modelUrl}`);
                })
                .catch((err) => {
                    // Erreur silencieuse - le jeu va recharger de toute façon si besoin
                    console.warn(`⚠️ Échec du préchargement du modèle: ${modelUrl}`, err);
                });
        });
    }).catch((err) => {
        console.warn('⚠️ Impossible d\'importer gltfLoader pour le préchargement', err);
    });
}
