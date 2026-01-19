// Memory - Collectible Glowing Items
class Memory extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, memoryText) {
        super(scene, x, y, 'memory');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(1.5);
        this.body.setSize(16, 16);
        this.body.setAllowGravity(false);
        
        this.memoryText = memoryText;
        this.active = true;
        this.collected = false;
        
        // Glow animation
        this.createGlow();
    }
    
    createGlow() {
        // Create a pulsing glow effect
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.5, to: 1 },
            scale: { from: 1.3, to: 1.7 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    collect() {
        if (this.collected) return false;
        
        this.collected = true;
        this.active = false;
        
        // Collection animation
        this.scene.tweens.add({
            targets: this,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
        
        return true;
    }
}
