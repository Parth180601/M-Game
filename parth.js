// Parth - The Love Interest
class Parth extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'parth');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setScale(2);
        
        this.body.setSize(12, 20);
        this.speed = 100;
        
        // Animation
        this.createAnimations();
        this.anims.play('parth-idle');
        
        // State
        this.followTarget = null;
        this.isWalking = false;
        
        // Name tag
        this.nameTag = new NameTag(scene, x, y, 'Parth', Colors.parth);
    }
    
    createAnimations() {
        if (!this.scene.anims.exists('parth-idle')) {
            const idleFrames = [];
            for (let i = 0; i < 3; i++) {
                idleFrames.push({ key: 'parth', frame: i });
            }
            this.scene.anims.create({
                key: 'parth-idle',
                frames: idleFrames,
                frameRate: 3,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('parth-walk')) {
            const walkFrames = [];
            for (let i = 3; i < 7; i++) {
                walkFrames.push({ key: 'parth', frame: i });
            }
            this.scene.anims.create({
                key: 'parth-walk',
                frames: walkFrames,
                frameRate: 6,
                repeat: -1
            });
        }
    }
    
    follow(target, offsetX = 50) {
        this.followTarget = target;
        this.followOffsetX = offsetX;
    }
    
    walkTo(x, speed = null) {
        this.targetX = x;
        this.walkSpeed = speed || this.speed;
        this.isWalking = true;
    }
    
    stopWalking() {
        this.isWalking = false;
        this.setVelocityX(0);
        this.anims.play('parth-idle', true);
    }
    
    update() {
        if (this.isWalking && this.targetX !== undefined) {
            const dist = this.targetX - this.x;
            if (Math.abs(dist) > 5) {
                this.setVelocityX(Math.sign(dist) * this.walkSpeed);
                this.anims.play('parth-walk', true);
            } else {
                this.stopWalking();
            }
        } else if (this.followTarget) {
            const targetX = this.followTarget.x + this.followOffsetX;
            const dist = targetX - this.x;
            
            if (Math.abs(dist) > 10) {
                this.setVelocityX(Math.sign(dist) * this.speed);
                this.anims.play('parth-walk', true);
            } else {
                this.setVelocityX(0);
                this.anims.play('parth-idle', true);
            }
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
