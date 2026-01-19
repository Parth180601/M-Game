// Game Configuration
const GameConfig = {
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        // Reserve space for controls
        min: {
            width: 800,
            height: 500
        }
    }
};

// Color Palette (Pastel Pixel Art)
const Colors = {
    background: {
        level1: 0xf4e4c1,  // Warm pastel
        level2: 0x2d3748,  // Evening city
        level3: 0x4a5568,  // Rainy fog
        level4: 0xffd89b   // Golden sunrise
    },
    mahika: 0xffb6c1,      // Pink
    lia: 0xd4a574,         // Brown
    parth: 0x87ceeb,       // Sky blue
    memory: 0xffd700,      // Gold
    text: 0xffffff,
    accent: 0xff69b4
};

// Dialogue Data
const Dialogues = {
    level1: {
        idle: [
            "Okay Lia, hear me out… what if today is important?",
            "I know I talk a lot — thinking out loud helps!",
            "Sometimes the quietest moments are the loudest, you know?",
            "Lia, do you think we're going somewhere special today?",
            "This park feels different today... like something's about to change.",
            "You know what, Lia? I think today might be the day everything shifts."
        ],
        memories: [
            "Some beginnings don't announce themselves. They just... happen.",
            "Comfort can feel instant. Like you've known someone forever, even when you haven't.",
            "A smile can stay longer than a moment. It can stay in your heart forever."
        ],
        endCutscene: "Wait… why does my heart recognize him? Have I... have I seen him before?"
    },
    level2: {
        walking: "I usually fill silences… but this one feels nice. Comfortable.",
        bench: "Talking didn't feel necessary. Being there was enough. Just... existing together.",
        parth: "You don't have to explain yourself. I like listening to you talk.",
        interaction1: "Walking through Pune's streets feels different with someone beside you.",
        interaction2: "The city lights seem brighter tonight, don't they?",
        interaction3: "I could walk like this forever... just the three of us."
    },
    level3: {
        start: "Okay okay… no pressure. Just my entire heart on the line. No big deal.",
        correct: "Some choices feel scary… until they feel right. And this? This feels right.",
        parth: "I was never going anywhere. I'm right here, with you.",
        wrongPath: "Hmm, this doesn't feel right... Lia, are you sure about this path?"
    },
    level4: {
        walking: "Every step feels like coming home. Taljai Hill... I've always loved this place.",
        proposal: "I don't need you to stop talking. I just want to listen… forever. Will you marry me?",
        approaching: "Taljai Hill at sunrise... there's no place more perfect for this moment."
    },
    lia: {
        barks: [
            "Woof! Woof!",
            "Bark! Bark!",
            "Woof woof woof!",
            "Arf! Arf!",
            "Woof!"
        ],
        memoryFound: "Woof! Woof! (Found something!)",
        pathFound: "Bark! Bark! (This way!)",
        happy: "Woof woof! (Happy!)"
    }
};
