// Ending Scene
class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndingScene' });
    }
    
    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2a1f3d);
        
        // Ending text
        const title = this.add.text(400, 150, 'Mahika followed her heart.', {
            fontSize: '28px',
            fill: '#ffb6c1',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        const line2 = this.add.text(400, 220, 'Parth walked beside her.', {
            fontSize: '28px',
            fill: '#87ceeb',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        line2.setOrigin(0.5);
        
        const line3 = this.add.text(400, 290, 'And Lia made sure they were never alone.', {
            fontSize: '28px',
            fill: '#d4a574',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        line3.setOrigin(0.5);
        
        const line4 = this.add.text(400, 360, 'Happy Anniversary ❤️', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        line4.setOrigin(0.5);
        
        const line5 = this.add.text(400, 400, 'Go Hard or Go Home', {
            fontSize: '32px',
            fill: '#ff69b4',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        line5.setOrigin(0.5);
        
        // Replay button
        const replayBtn = this.add.rectangle(400, 480, 250, 60, 0xffb6c1);
        replayBtn.setInteractive({ useHandCursor: true });
        
        const replayText = this.add.text(400, 480, 'Replay Journey', {
            fontSize: '24px',
            fill: '#000000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        replayText.setOrigin(0.5);
        
        replayBtn.on('pointerdown', () => {
            this.scene.start('Level1');
        });
        
        replayBtn.on('pointerover', () => {
            replayBtn.setFillStyle(0xff69b4);
        });
        
        replayBtn.on('pointerout', () => {
            replayBtn.setFillStyle(0xffb6c1);
        });
        
        // Hide controls
        const controls = document.getElementById('controls');
        if (controls) controls.classList.add('hidden');
        
        // Animate text appearance
        title.setAlpha(0);
        line2.setAlpha(0);
        line3.setAlpha(0);
        line4.setAlpha(0);
        line5.setAlpha(0);
        
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 1000,
            delay: 500
        });
        
        this.tweens.add({
            targets: line2,
            alpha: 1,
            duration: 1000,
            delay: 2000
        });
        
        this.tweens.add({
            targets: line3,
            alpha: 1,
            duration: 1000,
            delay: 3500
        });
        
        this.tweens.add({
            targets: line4,
            alpha: 1,
            duration: 1000,
            delay: 5000
        });
        
        this.tweens.add({
            targets: line5,
            alpha: 1,
            duration: 1000,
            delay: 6500
        });
    }
}
