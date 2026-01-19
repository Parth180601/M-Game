// Name Tag System - Shows character names above sprites
class NameTag extends Phaser.GameObjects.Container {
    constructor(scene, x, y, name, color = 0xffffff) {
        super(scene, x, y);
        
        this.name = name;
        this.color = color;
        
        // Create background
        this.background = scene.add.rectangle(0, -25, name.length * 8 + 10, 20, 0x000000, 0.7);
        this.background.setStrokeStyle(2, color);
        
        // Create text
        this.text = scene.add.text(0, -25, name, {
            fontSize: '12px',
            fill: '#' + color.toString(16).padStart(6, '0'),
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        this.text.setOrigin(0.5);
        
        // Add to container
        this.add([this.background, this.text]);
        
        // Make it follow the character
        this.setDepth(1000); // Always on top
        scene.add.existing(this);
    }
    
    updatePosition(targetX, targetY) {
        this.setPosition(targetX, targetY - 30);
    }
    
    setColor(color) {
        this.color = color;
        this.background.setStrokeStyle(2, color);
        this.text.setColor('#' + color.toString(16).padStart(6, '0'));
    }
}
