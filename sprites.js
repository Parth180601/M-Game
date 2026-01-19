// Sprite Generator - Creates pixel art sprites programmatically
class SpriteGenerator {
    static createMahikaSprite(scene) {
        const size = 16;
        const frames = 8;
        const sheetWidth = size * frames;
        const sheetHeight = size;
        
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Create sprite sheet
        for (let frame = 0; frame < frames; frame++) {
            const offsetX = frame * size;
            
            graphics.fillStyle(0xffb6c1); // Pink
            
            // Body
            graphics.fillRect(offsetX + 6, 8, 4, 6);
            
            // Head
            graphics.fillRect(offsetX + 5, 2, 6, 6);
            
            // Arms (walking animation)
            if (frame >= 4) {
                graphics.fillRect(offsetX + 3, 9, 3, 4);
                graphics.fillRect(offsetX + 10, 9, 3, 4);
            } else {
                graphics.fillRect(offsetX + 2, 9, 3, 4);
                graphics.fillRect(offsetX + 11, 9, 3, 4);
            }
            
            // Legs
            graphics.fillRect(offsetX + 6, 14, 2, 4);
            graphics.fillRect(offsetX + 8, 14, 2, 4);
            
            // Hair
            graphics.fillStyle(0xff69b4);
            graphics.fillRect(offsetX + 5, 0, 6, 3);
            
            // Eyes (blink on frame 2)
            if (frame !== 2) {
                graphics.fillStyle(0x000000);
                graphics.fillRect(offsetX + 6, 4, 1, 1);
                graphics.fillRect(offsetX + 9, 4, 1, 1);
            }
        }
        
        graphics.generateTexture('mahika', sheetWidth, sheetHeight);
        graphics.destroy();
        
        // Configure frame size for sprite sheet
        if (scene.textures.exists('mahika')) {
            scene.textures.get('mahika').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
    }
    
    static createLiaSprite(scene) {
        const size = 16;
        const frames = 10;
        const sheetWidth = size * frames;
        const sheetHeight = size;
        
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        for (let frame = 0; frame < frames; frame++) {
            const offsetX = frame * size;
            
            graphics.fillStyle(0xd4a574); // Brown
            
            // Body
            graphics.fillRect(offsetX + 4, 6, 8, 6);
            
            // Head
            graphics.fillRect(offsetX + 5, 2, 6, 5);
            
            // Snout
            graphics.fillRect(offsetX + 3, 4, 3, 2);
            
            // Ears
            graphics.fillRect(offsetX + 4, 1, 2, 3);
            graphics.fillRect(offsetX + 10, 1, 2, 3);
            
            // Tail
            if (frame >= 3 && frame < 7) {
                graphics.fillRect(offsetX + 11, 8, 3, 2);
            } else if (frame >= 7) {
                graphics.fillRect(offsetX + 11, 6, 2, 4);
            } else {
                graphics.fillRect(offsetX + 11, 9, 3, 2);
            }
            
            // Legs
            graphics.fillRect(offsetX + 5, 12, 2, 4);
            graphics.fillRect(offsetX + 9, 12, 2, 4);
            
            // Eyes
            graphics.fillStyle(0x000000);
            graphics.fillRect(offsetX + 6, 3, 1, 1);
            graphics.fillRect(offsetX + 9, 3, 1, 1);
            
            // Mouth (open for bark)
            if (frame >= 7) {
                graphics.fillRect(offsetX + 4, 5, 2, 1);
            }
        }
        
        graphics.generateTexture('lia', sheetWidth, sheetHeight);
        graphics.destroy();
    }
    
    static createParthSprite(scene) {
        const size = 16;
        const frames = 7;
        const sheetWidth = size * frames;
        const sheetHeight = size;
        
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        for (let frame = 0; frame < frames; frame++) {
            const offsetX = frame * size;
            
            graphics.fillStyle(0x87ceeb); // Sky blue
            
            // Body
            graphics.fillRect(offsetX + 6, 8, 4, 6);
            
            // Head
            graphics.fillRect(offsetX + 5, 2, 6, 6);
            
            // Arms
            if (frame >= 3) {
                graphics.fillRect(offsetX + 3, 9, 3, 4);
                graphics.fillRect(offsetX + 10, 9, 3, 4);
            } else {
                graphics.fillRect(offsetX + 2, 9, 3, 4);
                graphics.fillRect(offsetX + 11, 9, 3, 4);
            }
            
            // Legs
            graphics.fillRect(offsetX + 6, 14, 2, 4);
            graphics.fillRect(offsetX + 8, 14, 2, 4);
            
            // Hair
            graphics.fillStyle(0x4682b4);
            graphics.fillRect(offsetX + 5, 0, 6, 3);
            
            // Eyes
            graphics.fillStyle(0x000000);
            graphics.fillRect(offsetX + 6, 4, 1, 1);
            graphics.fillRect(offsetX + 9, 4, 1, 1);
        }
        
        graphics.generateTexture('parth', sheetWidth, sheetHeight);
        graphics.destroy();
    }
    
    static createMemorySprite(scene) {
        const size = 16;
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        graphics.fillStyle(0xffd700); // Gold
        graphics.fillCircle(8, 8, 6);
        
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 4);
        
        graphics.fillStyle(0xffd700);
        graphics.fillCircle(8, 8, 2);
        
        graphics.generateTexture('memory', size, size);
        graphics.destroy();
    }
    
    static createGroundSprite(scene) {
        const size = 32;
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        graphics.fillStyle(0x8b7355);
        graphics.fillRect(0, 0, size, size);
        
        graphics.generateTexture('ground', size, size);
        graphics.destroy();
    }
    
    static createAllSprites(scene) {
        this.createMahikaSprite(scene);
        this.createLiaSprite(scene);
        this.createParthSprite(scene);
        this.createMemorySprite(scene);
        this.createGroundSprite(scene);
        
        // Configure sprite sheet frame sizes
        this.configureSpriteSheet(scene, 'mahika', 16, 16, 8);
        this.configureSpriteSheet(scene, 'lia', 16, 16, 10);
        this.configureSpriteSheet(scene, 'parth', 16, 16, 7);
    }
    
    static configureSpriteSheet(scene, key, frameWidth, frameHeight, frameCount) {
        if (scene.textures.exists(key)) {
            const texture = scene.textures.get(key);
            // Add frames to the texture manually
            for (let i = 0; i < frameCount; i++) {
                texture.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
            }
            texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        } else {
            // Fallback: create simple colored rectangles as placeholders
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xffb6c1);
            graphics.fillRect(0, 0, frameWidth, frameHeight);
            graphics.generateTexture(key, frameWidth, frameHeight);
            graphics.destroy();
        }
    }
}
