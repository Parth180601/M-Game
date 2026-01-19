// Level 4: The Promise
class Level4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4' });
    }
    
    create() {
        SpriteGenerator.createAllSprites(this);
        
        this.cameras.main.setBackgroundColor(Colors.background.level4);
        
        // Hilltop scene
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 580, 'ground').setScale(1000, 1).refreshBody();
        
        // Create hilltop environment
        this.createEnvironment();
        
        // Characters
        this.mahika = new Mahika(this, 200, 400);
        this.lia = new Lia(this, 180, 400);
        this.parth = new Parth(this, 220, 400);
        
        this.lia.follow(this.mahika);
        this.parth.follow(this.mahika, 20);
        
        // Proposal point with visual indicator
        this.proposalPoint = { x: 700, y: 500 };
        this.proposalTriggered = false;
        
        // Create visual indicator for proposal point
        this.time.delayedCall(200, () => {
            this.createProposalIndicator();
        });
        
        // Dialogue
        this.dialogue = new DialogueSystem(this);
        
        // Hint system
        this.hints = new HintSystem(this);
        this.hints.createHintBox();
        
        // Auto-scroll camera
        this.cameras.main.startFollow(this.mahika);
        this.cameras.main.setBounds(0, 0, 1000, 600);
        
        // Slow auto-scroll effect
        this.autoScroll = true;
        this.scrollSpeed = 30;
        
        this.setupControls();
        
        this.physics.add.collider(this.mahika, this.platforms);
        this.physics.add.collider(this.lia, this.platforms);
        this.physics.add.collider(this.parth, this.platforms);
        
        // Opening dialogue and hint
        this.time.delayedCall(1000, () => {
            this.dialogue.show('Mahika', Dialogues.level4.walking, () => {
                this.dialogue.show('Mahika', Dialogues.level4.approaching, () => {
                    this.dialogue.hide();
                });
            });
            this.time.delayedCall(5000, () => {
                this.hints.showHint(LevelHints.level4.initial, 6000);
            });
        });
    }
    
    createEnvironment() {
        // Sunrise sky gradient effect
        for (let i = 0; i < 10; i++) {
            const y = 50 + i * 50;
            const alpha = 0.1 + (i / 10) * 0.3;
            this.add.rectangle(400, y, 800, 50, 0xffd89b, alpha);
        }
        
        // Taljai Hill silhouette
        this.add.polygon(400, 500, [
            0, 100,
            200, 50,
            400, 30,
            600, 50,
            800, 100
        ], 0x8b7355);
        
        // Taljai Hill sign/name
        const hillName = this.add.text(400, 420, 'TALJAI HILL', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        hillName.setOrigin(0.5);
        hillName.setScrollFactor(1);
        hillName.setDepth(500);
        
        // Add some trees/vegetation on the hill
        for (let i = 0; i < 5; i++) {
            const x = 200 + i * 150;
            const treeY = 450 - Math.sin(i) * 20;
            this.add.rectangle(x, treeY, 20, 40, 0x228b22, 0.7);
            this.add.circle(x, treeY - 20, 25, 0x32cd32, 0.6);
        }
    }
    
    createProposalIndicator() {
        // Create a glowing indicator for the proposal point
        const indicator = this.add.circle(this.proposalPoint.x, this.proposalPoint.y - 50, 35, 0xffd700, 0.9);
        indicator.setStrokeStyle(4, 0xffffff);
        indicator.setScrollFactor(1);
        indicator.setDepth(1000);
        
        const heart = this.add.text(this.proposalPoint.x, this.proposalPoint.y - 50, '💍', {
            fontSize: '32px',
            fontFamily: 'Arial'
        });
        heart.setOrigin(0.5);
        heart.setScrollFactor(1);
        heart.setDepth(1001);
        
        // Pulsing animation
        this.tweens.add({
            targets: indicator,
            scale: { from: 1, to: 1.4 },
            alpha: { from: 0.7, to: 1 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tweens.add({
            targets: heart,
            scale: { from: 1, to: 1.3 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glow effect
        const glow = this.add.circle(this.proposalPoint.x, this.proposalPoint.y - 50, 50, 0xffd700, 0.4);
        glow.setScrollFactor(1);
        glow.setDepth(999);
        this.tweens.add({
            targets: glow,
            scale: { from: 1, to: 1.6 },
            alpha: { from: 0.4, to: 0.1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.proposalIndicator = indicator;
        this.proposalHeart = heart;
        this.proposalGlow = glow;
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
        if (!this.proposalTriggered) {
            const dist = Phaser.Math.Distance.Between(
                this.mahika.x, this.mahika.y,
                this.proposalPoint.x, this.proposalPoint.y
            );
            
            console.log(`Proposal point: Mahika at (${this.mahika.x}, ${this.mahika.y}), Point at (${this.proposalPoint.x}, ${this.proposalPoint.y}), Distance: ${dist.toFixed(2)}`);
            
            if (dist < 100) {
                this.proposalTriggered = true;
                this.hints.updateAction();
                
                // Hide indicator
                if (this.proposalIndicator) {
                    this.tweens.add({
                        targets: [this.proposalIndicator, this.proposalHeart, this.proposalGlow],
                        alpha: 0,
                        scale: 0,
                        duration: 500,
                        onComplete: () => {
                            if (this.proposalIndicator) this.proposalIndicator.destroy();
                            if (this.proposalHeart) this.proposalHeart.destroy();
                            if (this.proposalGlow) this.proposalGlow.destroy();
                        }
                    });
                }
                
                // Play special interaction sound for proposal
                if (this.game.audioManager) {
                    this.game.audioManager.playCollectionSound();
                }
                
                this.startProposal();
            } else if (dist < 200) {
                this.hints.showHint(`Get closer to the 💍 (${Math.round(dist)}px away)`, 3000);
            } else {
                this.hints.showHint(LevelHints.level4.stuck, 4000);
            }
        }
    }
    
    startProposal() {
        // Stop movement
        this.mahika.stop();
        this.parth.stopWalking();
        this.autoScroll = false;
        
        // Position characters
        this.parth.setX(this.mahika.x + 30);
        this.parth.setY(this.mahika.y);
        
        // Lia stops and barks
        this.lia.setX(this.mahika.x - 20);
        this.lia.bark();
        
        // Proposal cutscene
        this.time.delayedCall(1000, () => {
            // Parth kneels (visual effect - lower position)
            this.tweens.add({
                targets: this.parth,
                y: this.parth.y + 10,
                duration: 500
            });
            
            this.dialogue.show('Parth', Dialogues.level4.proposal, () => {
                this.dialogue.hide();
                
                // Lia barks happily
                this.lia.bark('happy');
                
                // Mahika nods (visual effect)
                this.tweens.add({
                    targets: this.mahika,
                    y: this.mahika.y - 5,
                    duration: 300,
                    yoyo: true,
                    repeat: 1
                });
                
                this.time.delayedCall(2000, () => {
                    this.scene.start('EndingScene');
                });
            });
        });
    }
    
    update() {
        if (this.autoScroll && this.mahika) {
            // Gentle forward movement
            if (this.mahika.x < 800) {
                this.mahika.setVelocityX(this.scrollSpeed);
                this.mahika.anims.play('mahika-walk', true);
            } else {
                this.mahika.stop();
            }
        }
        
        if (this.mahika) this.mahika.update();
        if (this.lia) this.lia.update();
        if (this.parth) this.parth.update();
        
        // Check if stuck
        if (this.hints && !this.proposalTriggered) {
            this.hints.checkForStuckPlayer(
                this.mahika.x < 400,
                LevelHints.level4.stuck
            );
        }
    }
}
