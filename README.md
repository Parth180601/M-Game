# 🎮 Mahika & the Way Home

A 2D Pixel Adventure Love Story - Built with Phaser.js

## 🌸 About

Mahika, a lively girl who yaps a lot, sets out on a quiet journey with her loyal dog Lia. Along the way, she meets Parth — calm, patient, and steady. Through moments of laughter, choice, and commitment, Mahika leads the journey that ends in marriage and a happily ever after.

## 🎮 Gameplay

- **Platform**: Mobile / iPad (works on desktop browsers too)
- **Controls**: 
  - Left/Right arrows to move
  - Up arrow to jump
  - ❤️ button to interact
- **No enemies, no death** - A peaceful, story-driven experience
- **Lia helps locate memories** - Follow your dog's barks!
- **Hints system** - Contextual hints help guide you through each level
- **Name tags** - See character names above Mahika, Lia, and Parth
- **Lofi background music** - Soft ambient music plays throughout the game

## 🗺️ Levels

1. **A Girl Who Talks to the World** - Collect 3 glowing memories in a peaceful park
2. **Walking Together** - Walk with Parth and interact at special moments
3. **Choosing Each Other** - Choose the right path through the fog
4. **The Promise** - Journey to the hilltop for the proposal
5. **Home** - The wedding ceremony

## 🎵 Music

The game includes procedurally generated lofi background music that plays automatically. The music features:
- Soft chord progressions (Am - F - C - G)
- Gentle bass line
- Ambient, relaxing atmosphere

**To use your own music file:**
1. Place your music file in an `assets/music/` folder
2. Uncomment the line in `js/scenes/Menu.js`:
   ```javascript
   this.game.audioManager.playMusicFile('assets/music/your-music.mp3');
   ```
3. The game will use your file, or fall back to generated music if the file isn't found

## 🚀 How to Play

1. Open `index.html` in a web browser
2. Click "Start Journey" to begin
3. Use the on-screen controls to move and interact
4. Follow Lia's barks to find memories
5. Watch for hints if you get stuck
6. Enjoy the story and music!

## 📱 Mobile Setup

For best mobile experience:
- Open the game in a mobile browser
- The game is optimized for touch controls
- Works best on iPad and larger mobile devices
- Music will start after user interaction (browser autoplay policy)

## 🛠️ Technical Details

- **Framework**: Phaser.js 3.80.1
- **Graphics**: Programmatically generated pixel art sprites
- **Physics**: Arcade physics engine
- **Audio**: Web Audio API for procedural music generation
- **No external assets required** - Everything is generated in code (except optional music file)

## 📝 Story Features

- Dialogue system with character voices
- Memory collection mechanics
- Interactive moments
- Cutscenes and story progression
- Beautiful ending sequence
- Contextual hints system
- Character name tags
- Ambient background music

Enjoy the journey! ❤️
