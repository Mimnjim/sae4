/**
 * Précharge les modèles 3D du jeu en arrière-plan
 * Utilise requestIdleCallback et délais pour ne pas bloquer l'interface
 * OPTIMISATION: Chargement sélectif selon la page
 */

// Modèles hero pour la page d'accueil (chargés dès le gateway screen)
const HERO_MODELS = [
    '/models/Tetsuo.glb',                           // Akira hero model
    '/models/Motoko_gltf/Motoko.glb',              // Motoko hero model
];

// Modèles nécessaires pour le jeu (page Experiences)
const GAME_MODELS = [
    '/game/assets/models/voiture/Voiture.gltf',      // Player bike
    '/game/assets/models/camion/camion.gltf',        // Enemy truck
    '/game/assets/models/main/Main_item.gltf',       // Collectible items
];

let hasPreloadedHero = false;
let hasPreloaded = false;

export function preloadHeroAssets() {
    // Éviter le double preload
    if (hasPreloadedHero) return;
    hasPreloadedHero = true;

    console.log('[gameAssetsPreloader] Démarrage du préchargement des modèles HERO');

    // Charger les modèles hero immédiatement (pas d'attente, c'est prioritaire)
    // Ils ont 15 seconds pour se charger
    import('./gltfLoader.js').then(({ loadGLTFWithProperPaths }) => {
        HERO_MODELS.forEach((modelUrl, index) => {
            // Délai minimal entre chaque modèle (100ms)
            const delayPerModel = 100;
            
            setTimeout(() => {
                loadGLTFWithProperPaths(modelUrl, { dracoSupport: true })
                    .then(() => {
                        console.log(`✅ Préchargement HERO réussi: ${modelUrl}`);
                    })
                    .catch((err) => {
                        console.warn(`⚠️ Échec du préchargement HERO: ${modelUrl}`, err);
                    });
            }, index * delayPerModel);
        });
    }).catch((err) => {
        console.warn('⚠️ Impossible d\'importer gltfLoader pour le préchargement HERO', err);
    });
}

export function preloadGameAssets() {
    // Éviter le double preload
    if (hasPreloaded) return;
    hasPreloaded = true;

    console.log('[gameAssetsPreloader] Démarrage du préchargement des modèles du jeu');

    // OPTIMISATION: Utiliser requestIdleCallback avec timeout court
    // pour charger VRAIMENT en arrière-plan
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
            preloadModels();
        }, { timeout: 8000 }); // Max 8 secondes avant timeout
    } else {
        // Fallback: charger après un délai plus long pour ne pas bloquer
        setTimeout(() => {
            preloadModels();
        }, 3000); // 3 secondes après le montage
    }
}

function preloadModels() {
    // Importer dynamiquement le loader
    import('./gltfLoader.js').then(({ loadGLTFWithProperPaths }) => {
        // Charger tous les modèles en parallèle, avec délai entre chaque
        GAME_MODELS.forEach((modelUrl, index) => {
            // Délai progressif pour ne pas surcharger le réseau/CPU
            const delayPerModel = 500; // 500ms entre chaque modèle
            
            setTimeout(() => {
                loadGLTFWithProperPaths(modelUrl, { dracoSupport: true })
                    .then(() => {
                        console.log(`✅ Préchargement du modèle réussi: ${modelUrl}`);
                    })
                    .catch((err) => {
                        // Erreur silencieuse - le jeu va recharger de toute façon si besoin
                        console.warn(`⚠️ Échec du préchargement du modèle: ${modelUrl}`, err);
                    });
            }, index * delayPerModel);
        });
    }).catch((err) => {
        console.warn('⚠️ Impossible d\'importer gltfLoader pour le préchargement', err);
    });
}
