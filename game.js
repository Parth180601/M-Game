// Main Game Entry Point
const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: GameConfig.width,
    height: GameConfig.height,
    parent: 'game-container',
    backgroundColor: 0x2a1f3d,
    pixelArt: GameConfig.pixelArt,
    physics: GameConfig.physics,
    scale: GameConfig.scale,
    scene: [MenuScene, Level1, Level2, Level3, Level4, EndingScene]
});

// Initialize on page load
window.addEventListener('load', () => {
    console.log('Mahika & the Way Home - Game Loaded');
    
    // Initialize audio context on user interaction (required by browsers)
    const initAudio = () => {
        if (game.scene.getScene('MenuScene')) {
            const menuScene = game.scene.getScene('MenuScene');
            if (!game.audioManager) {
                game.audioManager = new AudioManager(menuScene);
            }
        }
    };
    
    // Try to initialize audio on any user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
});
