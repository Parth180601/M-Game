// Menu Scene
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Initialize audio manager and start music
        if (!this.game.audioManager) {
            this.game.audioManager = new AudioManager(this);
        }
        
        // Start music when user interacts (browser autoplay policy)
        const startMusic = () => {
            if (!this.game.audioManager.isPlaying) {
                // Try to play external music file first, fallback to generated
                // Uncomment and add your music file path if you have one:
                // this.game.audioManager.playMusicFile('assets/music/lofi-background.mp3');
                
                // Otherwise, use generated lofi music
                this.game.audioManager.playLofiMusic();
            }
        };
        
        // Try to start music immediately
        startMusic();
        
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2a1f3d);
        
        // Title
        const title = this.add.text(400, 200, 'Mahika & the Way Home', {
            fontSize: '36px',
            fill: '#ffb6c1',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(400, 250, 'A 2D Pixel Adventure Love Story', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });
        subtitle.setOrigin(0.5);
        
        // Start button
        const startBtn = this.add.rectangle(400, 400, 200, 60, 0xffb6c1);
        startBtn.setInteractive({ useHandCursor: true });
        
        const startText = this.add.text(400, 400, 'Start Journey', {
            fontSize: '24px',
            fill: '#000000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        startText.setOrigin(0.5);
        
        startBtn.on('pointerdown', () => {
            startMusic(); // Ensure music starts on click (in case autoplay was blocked)
            this.scene.start('Level1');
        });
        
        startBtn.on('pointerover', () => {
            startBtn.setFillStyle(0xff69b4);
        });
        
        startBtn.on('pointerout', () => {
            startBtn.setFillStyle(0xffb6c1);
        });
        
        // Instructions
        const instructions = this.add.text(400, 500, 'Use arrow buttons to move\n❤️ to interact', {
            fontSize: '14px',
            fill: '#cccccc',
            fontFamily: 'Courier New',
            align: 'center'
        });
        instructions.setOrigin(0.5);
    }
}
