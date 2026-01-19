// Level 3: Choosing Each Other
class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3' });
    }
    
    create() {
        SpriteGenerator.createAllSprites(this);
        
        this.cameras.main.setBackgroundColor(Colors.background.level3);
        
        // Fog effect
        this.fog = this.add.rectangle(400, 300, 800, 600, 0x4a5568, 0.8);
        
        // Platforms with paths
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 580, 'ground').setScale(800, 1).refreshBody();
        
        // Create paths (3 paths, only one is correct)
        this.paths = [
            { x: 200, y: 500, correct: false },
            { x: 400, y: 500, correct: true },  // Correct path
            { x: 600, y: 500, correct: false }
        ];
        
        this.pathChosen = false;
        this.correctPathChosen = false;
        
        // Characters
        this.mahika = new Mahika(this, 100, 400);
        this.lia = new Lia(this, 80, 400);
        this.parth = new Parth(this, 120, 400);
        
        this.lia.follow(this.mahika);
        this.parth.follow(this.mahika, 30);
        
        // Visual path indicators with better visibility
        this.pathIndicators = [];
        this.paths.forEach((path, index) => {
            // Create visible path markers
            const indicator = this.add.circle(path.x, path.y - 30, 35, 0xffffff, 0.5);
            indicator.setStrokeStyle(3, path.correct ? 0x00ff00 : 0xff0000);
            indicator.setScrollFactor(1);
            indicator.setDepth(500);
            
            // Add arrow or marker
            const marker = this.add.text(path.x, path.y - 30, path.correct ? '✓' : '?', {
                fontSize: '24px',
                fill: path.correct ? '#00ff00' : '#ff0000',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            });
            marker.setOrigin(0.5);
            marker.setScrollFactor(1);
            marker.setDepth(501);
            
            // Pulsing animation
            this.tweens.add({
                targets: indicator,
                scale: { from: 1, to: 1.2 },
                alpha: { from: 0.5, to: 0.8 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.pathIndicators.push({
                circle: indicator,
                marker: marker,
                path: path
            });
        });
        
        // Lia will guide to correct path
        this.lia.targetPath = this.paths[1]; // Correct path
        
        // Dialogue
        this.dialogue = new DialogueSystem(this);
        
        // Hint system
        this.hints = new HintSystem(this);
        this.hints.createHintBox();
        
        this.cameras.main.startFollow(this.mahika);
        this.cameras.main.setBounds(0, 0, 800, 600);
        
        this.setupControls();
        
        this.physics.add.collider(this.mahika, this.platforms);
        this.physics.add.collider(this.lia, this.platforms);
        this.physics.add.collider(this.parth, this.platforms);
        
        // Opening dialogue and hint
        this.time.delayedCall(1000, () => {
            this.dialogue.show('Mahika', Dialogues.level3.start, () => {
                this.dialogue.hide();
            });
            this.time.delayedCall(4000, () => {
                this.hints.showHint(LevelHints.level3.initial, 6000);
            });
        });
    }
    
    setupControls() {
        const controls = document.getElementById('controls');
        controls.classList.remove('hidden');
        
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        const btnInteract = document.getElementById('btn-interact');
        
        const updateAction = () => {
            if (this.hints) this.hints.updateAction();
        };
        
        btnLeft.addEventListener('touchstart', () => { this.mahika.moveLeft(); updateAction(); });
        btnLeft.addEventListener('touchend', () => this.mahika.stop());
        btnLeft.addEventListener('mousedown', () => { this.mahika.moveLeft(); updateAction(); });
        btnLeft.addEventListener('mouseup', () => this.mahika.stop());
        
        btnRight.addEventListener('touchstart', () => { this.mahika.moveRight(); updateAction(); });
        btnRight.addEventListener('touchend', () => this.mahika.stop());
        btnRight.addEventListener('mousedown', () => { this.mahika.moveRight(); updateAction(); });
        btnRight.addEventListener('mouseup', () => this.mahika.stop());
        
        btnJump.addEventListener('touchstart', () => { this.mahika.jump(); updateAction(); });
        btnJump.addEventListener('mousedown', () => { this.mahika.jump(); updateAction(); });
        
        btnInteract.addEventListener('touchstart', () => { this.handleInteract(); updateAction(); });
        btnInteract.addEventListener('mousedown', () => { this.handleInteract(); updateAction(); });
    }
    
    handleInteract() {
        // Check which path player is near
        this.paths.forEach((path, index) => {
            const dist = Phaser.Math.Distance.Between(
                this.mahika.x, this.mahika.y,
                path.x, path.y
            );
            
            if (dist < 50 && !this.pathChosen) {
                this.pathChosen = true;
                this.hints.updateAction();
                
                if (path.correct) {
                    this.correctPathChosen = true;
                    
                    // Play success sound
                    if (this.game.audioManager) {
                        this.game.audioManager.playCollectionSound();
                    }
                    
                    // Clear fog
                    this.tweens.add({
                        targets: this.fog,
                        alpha: 0,
                        duration: 2000
                    });
                    
                    this.dialogue.show('Mahika', Dialogues.level3.correct, () => {
                        this.dialogue.show('Parth', Dialogues.level3.parth, () => {
                            this.dialogue.hide();
                            this.completeLevel();
                        });
                    });
                } else {
                    // Wrong path - loop back
                    this.dialogue.show('Mahika', Dialogues.level3.wrongPath, () => {
                        this.dialogue.hide();
                        this.hints.showHint(LevelHints.level3.path, 5000);
                        // Reset position
                        this.time.delayedCall(1000, () => {
                            this.mahika.setX(100);
                            this.pathChosen = false;
                        });
                    });
                }
            } else if (dist > 50 && dist < 150 && !this.pathChosen) {
                this.hints.showHint(LevelHints.level3.interact, 4000);
            }
        });
    }
    
    update() {
        if (this.mahika) {
            this.mahika.update();
            
            // Guide player with Lia's position
            if (!this.pathChosen && this.lia) {
                const distToCorrect = Phaser.Math.Distance.Between(
                    this.mahika.x, this.mahika.y,
                    this.paths[1].x, this.paths[1].y
                );
                
                if (distToCorrect < 120) {
                    // Lia barks to indicate correct path
                    if (!this.lia.barkCooldown) {
                        this.lia.bark('path');
                        this.lia.barkCooldown = true;
                        this.time.delayedCall(3000, () => {
                            this.lia.barkCooldown = false;
                        });
                    }
                    if (this.hints && !this.hints.currentHint) {
                        this.hints.showHint(LevelHints.level3.path, 5000);
                    }
                }
            }
        }
        if (this.lia) this.lia.update();
        if (this.parth) this.parth.update();
        
        // Check if stuck
        if (this.hints && !this.pathChosen) {
            this.hints.checkForStuckPlayer(
                true,
                LevelHints.level3.stuck
            );
        }
    }
    
    completeLevel() {
        this.time.delayedCall(2000, () => {
            this.scene.start('Level4');
        });
    }
}
