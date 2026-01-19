// Mahika - The Player Character
class Mahika extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mahika');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setScale(2);
        
        // Physics properties
        this.body.setSize(12, 20);
        this.speed = 150;
        this.jumpPower = -400;
        
        // Animation
        this.createAnimations();
        // Try to play idle, but don't fail if animation doesn't exist yet
        try {
            this.anims.play('mahika-idle');
        } catch (e) {
            // Animation will be set up after sprite generation
        }
        
        // State
        this.isGrounded = false;
        this.facingRight = true;
        
        // Name tag
        this.nameTag = new NameTag(scene, x, y, 'Mahika', Colors.mahika);
        
        // Idle dialogue timer
        this.idleTimer = scene.time.addEvent({
            delay: 8000,
            callback: () => {
                if (scene.dialogue && !scene.dialogue.isShowing) {
                    scene.dialogue.showRandomIdle(scene.idleDialogues || []);
                }
            },
            loop: true
        });
    }
    
    createAnimations() {
        if (!this.scene.anims.exists('mahika-idle')) {
            // Create frames manually for horizontal sprite sheet
            const idleFrames = [];
            for (let i = 0; i < 4; i++) {
                idleFrames.push({ key: 'mahika', frame: i });
            }
            this.scene.anims.create({
                key: 'mahika-idle',
                frames: idleFrames,
                frameRate: 4,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('mahika-walk')) {
            const walkFrames = [];
            for (let i = 4; i < 8; i++) {
                walkFrames.push({ key: 'mahika', frame: i });
            }
            this.scene.anims.create({
                key: 'mahika-walk',
                frames: walkFrames,
                frameRate: 8,
                repeat: -1
            });
        }
    }
    
    moveLeft() {
        this.setVelocityX(-this.speed);
        if (this.facingRight) {
            this.setFlipX(true);
            this.facingRight = false;
        }
        if (this.isGrounded) {
            this.anims.play('mahika-walk', true);
        }
    }
    
    moveRight() {
        this.setVelocityX(this.speed);
        if (!this.facingRight) {
            this.setFlipX(false);
            this.facingRight = true;
        }
        if (this.isGrounded) {
            this.anims.play('mahika-walk', true);
        }
    }
    
    stop() {
        this.setVelocityX(0);
        if (this.isGrounded) {
            this.anims.play('mahika-idle', true);
        }
    }
    
    jump() {
        if (this.isGrounded) {
            this.setVelocityY(this.jumpPower);
            this.isGrounded = false;
        }
    }
    
    update() {
        // Check if grounded
        if (this.body.blocked.down || this.body.touching.down) {
            if (!this.isGrounded) {
                this.isGrounded = true;
            }
        } else {
            this.isGrounded = false;
        }
        
        // Update animation based on velocity
        if (this.body.velocity.x === 0 && this.isGrounded) {
            this.anims.play('mahika-idle', true);
        }
        
        // Update name tag position
        if (this.nameTag) {
            this.nameTag.updatePosition(this.x, this.y);
        }
    }
    
    destroy() {
        if (this.nameTag) {
            this.nameTag.destroy();
        }
        super.destroy();
    }
}
