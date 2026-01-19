// Level 2: Walking Together
class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }
    
    create() {
        SpriteGenerator.createAllSprites(this);
        
        this.cameras.main.setBackgroundColor(Colors.background.level2);
        
        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 580, 'ground').setScale(1200, 1).refreshBody();
        
        // Create environment
        this.createEnvironment();
        
        // Create characters
        this.mahika = new Mahika(this, 100, 400);
        this.lia = new Lia(this, 80, 400);
        this.parth = new Parth(this, 150, 400);
        
        this.lia.follow(this.mahika);
        this.parth.follow(this.mahika, 50);
        
        // Interaction points with visual indicators
        // Adjusted Y position to match character ground level better
        this.interactionPoints = [
            { x: 300, y: 500, triggered: false, indicator: null, heart: null },
            { x: 500, y: 500, triggered: false, indicator: null, heart: null },
            { x: 700, y: 500, triggered: false, indicator: null, heart: null }
        ];
        this.interactionsCompleted = 0;
        
        // Create visual indicators for interaction points (after a small delay to ensure camera is ready)
        this.time.delayedCall(200, () => {
            this.createInteractionIndicators();
        });
        
        // Dialogue
        this.dialogue = new DialogueSystem(this);
        
        // Hint system
        this.hints = new HintSystem(this);
        this.hints.createHintBox();
        
        // Camera
        this.cameras.main.startFollow(this.mahika);
        this.cameras.main.setBounds(0, 0, 1200, 600);
        
        this.setupControls();
        
        this.physics.add.collider(this.mahika, this.platforms);
        this.physics.add.collider(this.lia, this.platforms);
        this.physics.add.collider(this.parth, this.platforms);
        
        // Opening dialogue and hint
        this.time.delayedCall(1000, () => {
            this.dialogue.show('Mahika', Dialogues.level2.walking, () => {
                setTimeout(() => this.dialogue.hide(), 2000);
            });
            this.time.delayedCall(4000, () => {
                this.hints.showHint(LevelHints.level2.initial, 6000);
            });
        });
        
        // Debug info
        console.log('Level 2 initialized with interaction points at:', 
            this.interactionPoints.map(p => `(${p.x}, ${p.y})`).join(', '));
    }
    
    createEnvironment() {
        // Evening city - streetlights
        for (let i = 0; i < 8; i++) {
            const x = 150 + i * 150;
            const light = this.add.circle(x, 200, 20, 0xffd700, 0.3);
            this.add.rectangle(x, 250, 5, 100, 0x696969);
        }
        
        // Pune City Shops and Cafes
        // Momo Panda
        const momoPandaX = 250;
        this.add.rectangle(momoPandaX, 450, 80, 60, 0xff6b6b, 0.8);
        this.add.text(momoPandaX, 430, 'MOMO', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(momoPandaX, 445, 'PANDA', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.rectangle(momoPandaX, 480, 80, 20, 0x8b4513); // Sign board
        
        // Crema Cafe
        const cremaX = 500;
        this.add.rectangle(cremaX, 450, 90, 60, 0xd4a574, 0.8);
        this.add.text(cremaX, 430, 'CREMA', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(cremaX, 450, 'CAFE', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.rectangle(cremaX, 480, 90, 20, 0x654321); // Sign board
        
        // Additional shops
        const AnutyShopX = 750;
        this.add.rectangle(AnutyShopX, 450, 70, 60, 0x87ceeb, 0.8);
        this.add.text(AnutyShopX, 440, 'SHOP', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.rectangle(AnutyShopX, 480, 70, 20, 0x4682b4);
        
        // City buildings in background
        for (let i = 0; i < 6; i++) {
            const x = 100 + i * 180;
            const height = 80 + Math.random() * 40;
            this.add.rectangle(x, 350 - height/2, 60, height, 0x4a5568, 0.6);
            // Windows
            for (let w = 0; w < 3; w++) {
                for (let h = 0; h < Math.floor(height/30); h++) {
                    this.add.rectangle(x - 20 + w * 20, 350 - height/2 + 10 + h * 25, 12, 15, 0xffd700, 0.3);
                }
            }
        }
        
        // Benches
        for (let i = 0; i < 3; i++) {
            const x = 300 + i * 200;
            this.add.rectangle(x, 550, 50, 10, 0x654321);
        }
    }
    
    createInteractionIndicators() {
        this.interactionPoints.forEach((point, index) => {
            if (point.triggered) return; // Skip if already triggered
            
            // Create a glowing heart indicator above each interaction point
            const indicator = this.add.circle(point.x, point.y - 50, 30, 0xff69b4, 0.9);
            indicator.setStrokeStyle(4, 0xffffff);
            indicator.setScrollFactor(1); // Stay in world space
            indicator.setDepth(1000); // Make sure it's on top
            
            // Add heart icon
            const heart = this.add.text(point.x, point.y - 50, '❤️', {
                fontSize: '28px',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            });
            heart.setOrigin(0.5);
            heart.setScrollFactor(1); // Stay in world space
            heart.setDepth(1001); // Above the circle
            
            // Add pulsing animation
            this.tweens.add({
                targets: indicator,
                scale: { from: 1, to: 1.4 },
                alpha: { from: 0.7, to: 1 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.tweens.add({
                targets: heart,
                scale: { from: 1, to: 1.3 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Add a subtle glow effect
            const glow = this.add.circle(point.x, point.y - 50, 40, 0xff69b4, 0.3);
            glow.setScrollFactor(1);
            glow.setDepth(999);
            this.tweens.add({
                targets: glow,
                scale: { from: 1, to: 1.5 },
                alpha: { from: 0.3, to: 0.1 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Store reference to hide when triggered
            point.indicator = indicator;
            point.heart = heart;
            point.glow = glow;
            
            console.log(`✅ Created interaction point ${index} at (${point.x}, ${point.y})`);
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
        let foundInteraction = false;
        
        this.interactionPoints.forEach((point, index) => {
            if (!point.triggered) {
                const dist = Phaser.Math.Distance.Between(
                    this.mahika.x, this.mahika.y,
                    point.x, point.y
                );
                
                console.log(`Interaction point ${index}: Mahika at (${this.mahika.x}, ${this.mahika.y}), Point at (${point.x}, ${point.y}), Distance: ${dist.toFixed(2)}`);
                
                if (dist < 80) { // Increased range slightly
                    foundInteraction = true;
                    point.triggered = true;
                    this.interactionsCompleted++;
                    this.hints.updateAction();
                    
                    console.log(`✅ Interaction ${index} triggered! Total: ${this.interactionsCompleted}/3`);
                    
                    // Play interaction sound
                    if (this.game.audioManager) {
                        this.game.audioManager.playInteractionSound();
                    }
                    
                    // Hide the indicator
                    if (point.indicator) {
                        const targets = [point.indicator, point.heart];
                        if (point.glow) targets.push(point.glow);
                        
                        this.tweens.add({
                            targets: targets,
                            alpha: 0,
                            scale: 0,
                            duration: 500,
                            onComplete: () => {
                                if (point.indicator) point.indicator.destroy();
                                if (point.heart) point.heart.destroy();
                                if (point.glow) point.glow.destroy();
                            }
                        });
                    }
                    
                    if (index === 0) {
                        // First interaction - near Momo Panda
                        this.dialogue.show('Mahika', Dialogues.level2.interaction1, () => {
                            this.dialogue.hide();
                        });
                    } else if (index === 1) {
                        // Bench interaction - near Crema
                        this.dialogue.show('Mahika', Dialogues.level2.bench, () => {
                            this.dialogue.show('Parth', Dialogues.level2.parth, () => {
                                this.dialogue.hide();
                            });
                        });
                    } else {
                        // Third interaction
                        this.dialogue.show('Mahika', Dialogues.level2.interaction3, () => {
                            this.dialogue.show('Parth', Dialogues.level2.interaction2, () => {
                                this.dialogue.hide();
                            });
                        });
                    }
                    
                    // Show progress
                    if (this.interactionsCompleted < 3) {
                        this.time.delayedCall(2000, () => {
                            this.hints.showHint(`Interactions: ${this.interactionsCompleted}/3`, 4000);
                        });
                    }
                    
                    if (this.interactionsCompleted >= 3) {
                        this.completeLevel();
                    }
                } else if (dist < 150) {
                    // Close but not close enough - show hint
                    if (!this.hints.currentHint && !foundInteraction) {
                        this.hints.showHint(`Get closer to the ❤️ (${Math.round(dist)}px away)`, 3000);
                    }
                }
            }
        });
        
        if (!foundInteraction && this.interactionsCompleted < 3) {
            // Show hint if no interaction found
            const activePoints = this.interactionPoints.filter(p => !p.triggered);
            if (activePoints.length > 0) {
                const closest = activePoints.reduce((closest, point) => {
                    const dist = Phaser.Math.Distance.Between(
                        this.mahika.x, this.mahika.y,
                        point.x, point.y
                    );
                    return dist < closest.dist ? { point, dist } : closest;
                }, { point: null, dist: Infinity });
                
                if (closest.dist > 150) {
                    this.hints.showHint('Walk forward to find interaction points marked with ❤️', 4000);
                }
            }
        }
    }
    
    completeLevel() {
        this.time.delayedCall(2000, () => {
            this.scene.start('Level3');
        });
    }
    
    update() {
        if (this.mahika) this.mahika.update();
        if (this.lia) this.lia.update();
        if (this.parth) this.parth.update();
        
        // Debug: Show interaction point positions (remove in production)
        if (this.mahika && this.interactionsCompleted < 3) {
            // Check if we're near any interaction point and show visual feedback
            this.interactionPoints.forEach((point, index) => {
                if (!point.triggered && point.indicator) {
                    const dist = Phaser.Math.Distance.Between(
                        this.mahika.x, this.mahika.y,
                        point.x, point.y
                    );
                    
                    // Make indicator more visible when close
                    if (dist < 150) {
                        point.indicator.setAlpha(1);
                        point.heart.setAlpha(1);
                    } else {
                        point.indicator.setAlpha(0.6);
                        point.heart.setAlpha(0.6);
                    }
                }
            });
        }
        
        // Check if stuck
        if (this.hints && this.interactionsCompleted < 3) {
            this.hints.checkForStuckPlayer(
                this.interactionsCompleted === 0,
                LevelHints.level2.stuck
            );
        }
    }
}
