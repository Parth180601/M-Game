// Level 1: A Girl Who Talks to the World
class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }
    
    preload() {
        // Sprites will be generated programmatically
    }
    
    create() {
        // Generate sprites first
        SpriteGenerator.createAllSprites(this);
        
        // Small delay to ensure textures are ready
        this.time.delayedCall(100, () => {
            this.setupLevel();
        });
    }
    
    setupLevel() {
        // Ensure music is playing
        if (this.game.audioManager && !this.game.audioManager.isPlaying) {
            this.game.audioManager.playLofiMusic();
        }
        
        // Background
        this.cameras.main.setBackgroundColor(Colors.background.level1);
        
        // Create ground platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 580, 'ground').setScale(800, 1).refreshBody();
        
        // Create decorative elements
        this.createEnvironment();
        
        // Create player
        this.mahika = new Mahika(this, 100, 400);
        this.mahika.idleDialogues = Dialogues.level1.idle;
        
        // Create Lia
        this.lia = new Lia(this, 80, 400);
        this.lia.follow(this.mahika);
        
        // Create memories
        this.memories = [];
        const memoryPositions = [
            { x: 250, y: 450, text: Dialogues.level1.memories[0] },
            { x: 500, y: 450, text: Dialogues.level1.memories[1] },
            { x: 700, y: 450, text: Dialogues.level1.memories[2] }
        ];
        
        memoryPositions.forEach(pos => {
            const memory = new Memory(this, pos.x, pos.y, pos.text);
            this.memories.push(memory);
        });
        
        this.memoriesCollected = 0;
        this.totalMemories = 3;
        
        // Dialogue system
        this.dialogue = new DialogueSystem(this);
        
        // Hint system
        this.hints = new HintSystem(this);
        this.hints.createHintBox();
        
        // Camera follows player
        this.cameras.main.startFollow(this.mahika);
        this.cameras.main.setBounds(0, 0, 800, 600);
        
        // Setup controls
        this.setupControls();
        
        // Collision detection
        this.physics.add.overlap(this.mahika, this.memories, this.collectMemory, null, this);
        this.physics.add.collider(this.mahika, this.platforms);
        this.physics.add.collider(this.lia, this.platforms);
        
        // Welcome dialogue and initial hint
        this.time.delayedCall(1000, () => {
            this.dialogue.show('Mahika', Dialogues.level1.idle[0], () => {
                setTimeout(() => this.dialogue.hide(), 2000);
            });
            // Show initial hint after dialogue
            this.time.delayedCall(4000, () => {
                this.hints.showHint(LevelHints.level1.initial, 6000);
            });
        });
    }
    
    createEnvironment() {
        // Pune park - Trees
        for (let i = 0; i < 5; i++) {
            const x = 150 + i * 150;
            const tree = this.add.rectangle(x, 500, 30, 80, 0x8b4513);
            this.add.rectangle(x, 460, 50, 40, 0x228b22);
        }
        
        // Park benches
        for (let i = 0; i < 3; i++) {
            const x = 200 + i * 200;
            this.add.rectangle(x, 550, 40, 10, 0x654321);
        }
        
        // Add some Pune city elements in background (distant buildings)
        for (let i = 0; i < 4; i++) {
            const x = 100 + i * 200;
            const height = 60 + Math.random() * 30;
            this.add.rectangle(x, 300 - height/2, 50, height, 0x696969, 0.4);
        }
    }
    
    setupControls() {
        const controls = document.getElementById('controls');
        controls.classList.remove('hidden');
        
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        const btnInteract = document.getElementById('btn-interact');
        
        // Touch controls with hint updates
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
        // Check if near memory
        this.memories.forEach(memory => {
            if (memory.active) {
                const dist = Phaser.Math.Distance.Between(
                    this.mahika.x, this.mahika.y,
                    memory.x, memory.y
                );
                if (dist < 50) {
                    this.collectMemory(this.mahika, memory);
                }
            }
        });
    }
    
    collectMemory(player, memory) {
        if (memory.collect()) {
            this.memoriesCollected++;
            const memoryIndex = this.memories.indexOf(memory);
            this.hints.updateAction();
            
            // Play collection sound
            if (this.game.audioManager) {
                this.game.audioManager.playCollectionSound();
            }
            
            this.dialogue.show('Mahika', Dialogues.level1.memories[memoryIndex], () => {
                this.dialogue.hide();
            });
            
            // Show progress hint
            if (this.memoriesCollected < this.totalMemories) {
                this.time.delayedCall(2000, () => {
                    this.hints.showHint(`Collected ${this.memoriesCollected}/${this.totalMemories} memories. Keep going!`, 4000);
                });
            }
            
            // Check if all memories collected
            if (this.memoriesCollected >= this.totalMemories) {
                this.completeLevel();
            }
        }
    }
    
    completeLevel() {
        // End cutscene
        this.dialogue.show('Mahika', Dialogues.level1.endCutscene, () => {
            this.dialogue.hide();
            // Show Parth in distance
            const parth = new Parth(this, 750, 450);
            parth.setAlpha(0.7);
            
            this.time.delayedCall(2000, () => {
                this.scene.start('Level2');
            });
        });
    }
    
    update() {
        if (this.mahika) this.mahika.update();
        if (this.lia) {
            this.lia.detectMemory(this.memories);
            this.lia.update();
            
            // Update indicator visibility based on distance
            if (this.lia.memoryNearby) {
                const dist = Phaser.Math.Distance.Between(
                    this.mahika.x, this.mahika.y,
                    this.lia.memoryNearby.x, this.lia.memoryNearby.y
                );
                if (dist < 100) {
                    // Lia is close to memory - already barking
                }
            }
        }
    }
}
