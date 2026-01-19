// Lia - The Loyal Dog Companion
class Lia extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'lia');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setScale(2);
        
        this.body.setSize(10, 12);
        this.speed = 120;
        
        // Animation
        this.createAnimations();
        this.anims.play('lia-idle');
        
        // State
        this.followTarget = null;
        this.memoryNearby = null;
        this.barkTimer = null;
        
        // Name tag
        this.nameTag = new NameTag(scene, x, y, 'Lia', Colors.lia);
    }
    
    createAnimations() {
        if (!this.scene.anims.exists('lia-idle')) {
            const idleFrames = [];
            for (let i = 0; i < 3; i++) {
                idleFrames.push({ key: 'lia', frame: i });
            }
            this.scene.anims.create({
                key: 'lia-idle',
                frames: idleFrames,
                frameRate: 3,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('lia-walk')) {
            const walkFrames = [];
            for (let i = 3; i < 7; i++) {
                walkFrames.push({ key: 'lia', frame: i });
            }
            this.scene.anims.create({
                key: 'lia-walk',
                frames: walkFrames,
                frameRate: 6,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('lia-bark')) {
            const barkFrames = [];
            for (let i = 7; i < 10; i++) {
                barkFrames.push({ key: 'lia', frame: i });
            }
            this.scene.anims.create({
                key: 'lia-bark',
                frames: barkFrames,
                frameRate: 8,
                repeat: 0
            });
        }
    }
    
    follow(target) {
        this.followTarget = target;
    }
    
    detectMemory(memories) {
        if (!memories || memories.length === 0) {
            this.memoryNearby = null;
            return;
        }
        
        let closest = null;
        let closestDist = 200; // Detection range
        
        memories.forEach(memory => {
            if (memory.active) {
                const dist = Phaser.Math.Distance.Between(
                    this.x, this.y,
                    memory.x, memory.y
                );
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = memory;
                }
            }
        });
        
        this.memoryNearby = closest;
        
        if (this.memoryNearby && !this.barkTimer) {
            this.bark('memory');
            this.barkTimer = this.scene.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.barkTimer = null;
                },
                loop: false
            });
        }
    }
    
    bark(context = null) {
        this.anims.play('lia-bark', true);
        
        // Show dialogue when Lia barks
        if (this.scene && this.scene.dialogue) {
            let barkText = Dialogues.lia.barks[Math.floor(Math.random() * Dialogues.lia.barks.length)];
            
            // Context-specific barks
            if (context === 'memory') {
                barkText = Dialogues.lia.memoryFound;
            } else if (context === 'path') {
                barkText = Dialogues.lia.pathFound;
            } else if (context === 'happy') {
                barkText = Dialogues.lia.happy;
            }
            
            // Show brief dialogue
            this.scene.dialogue.show('Lia 🐶', barkText, () => {
                setTimeout(() => {
                    if (this.scene.dialogue) {
                        this.scene.dialogue.hide();
                    }
                }, 1500);
            });
        }
        
        // Play bark sound if available
        if (this.scene && this.scene.game && this.scene.game.audioManager) {
            // Could add a bark sound effect here
        }
    }
    
    update() {
        // Follow target
        if (this.followTarget) {
            const dist = Phaser.Math.Distance.Between(
                this.x, this.y,
                this.followTarget.x, this.followTarget.y
            );
            
            if (dist > 30) {
                const angle = Phaser.Math.Angle.Between(
                    this.x, this.y,
                    this.followTarget.x, this.followTarget.y
                );
                this.setVelocityX(Math.cos(angle) * this.speed);
                
                if (this.body.velocity.x !== 0) {
                    this.anims.play('lia-walk', true);
                } else {
                    this.anims.play('lia-idle', true);
                }
            } else {
                this.setVelocityX(0);
                this.anims.play('lia-idle', true);
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
