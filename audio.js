// Audio Manager - Handles background music and sound effects
class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = null;
        this.musicGainNode = null;
        this.musicOscillators = [];
        this.isPlaying = false;
        this.volume = 0.3; // 30% volume for background music
        
        this.initAudio();
    }
    
    initAudio() {
        try {
            // Create AudioContext (works in modern browsers)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.musicGainNode = this.audioContext.createGain();
            this.musicGainNode.connect(this.audioContext.destination);
            this.musicGainNode.gain.value = this.volume;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    
    // Generate a simple lofi-style ambient background track
    playLofiMusic() {
        if (!this.audioContext) {
            // Try to resume if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            } else {
                return;
            }
        }
        
        if (this.isPlaying) return;
        
        try {
            // Resume audio context if needed (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            this.isPlaying = true;
            this.musicOscillators = [];
            
            // Create a simple lofi chord progression (Am - F - C - G)
            const chords = [
                [220, 261.63, 329.63], // Am (A, C, E)
                [174.61, 220, 261.63], // F (F, A, C)
                [130.81, 164.81, 196], // C (C, E, G)
                [196, 246.94, 293.66]  // G (G, B, D)
            ];
            
            const chordDuration = 2.0; // 2 seconds per chord
            let startTime = this.audioContext.currentTime;
            
            // Play each chord in sequence
            let chordIndex = 0;
            const playChord = () => {
                if (!this.isPlaying) return;
                
                const chord = chords[chordIndex];
                const currentTime = this.audioContext.currentTime;
                
                // Create oscillators for each note in the chord
                chord.forEach((freq, index) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    // Use triangle wave for softer sound
                    oscillator.type = 'triangle';
                    oscillator.frequency.value = freq;
                    
                    // Add slight detuning for lofi effect (subtle)
                    if (index > 0) {
                        oscillator.frequency.value += (Math.random() - 0.5) * 1.5;
                    }
                    
                    // Envelope for smooth attack and release
                    gainNode.gain.setValueAtTime(0, currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.12, currentTime + 0.3);
                    gainNode.gain.linearRampToValueAtTime(0.12, currentTime + chordDuration - 0.3);
                    gainNode.gain.linearRampToValueAtTime(0, currentTime + chordDuration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.musicGainNode);
                    
                    oscillator.start(currentTime);
                    oscillator.stop(currentTime + chordDuration);
                    
                    this.musicOscillators.push(oscillator);
                });
                
                // Move to next chord
                chordIndex = (chordIndex + 1) % chords.length;
                
                // Schedule next chord
                const nextChordTime = currentTime + chordDuration;
                const delay = (nextChordTime - this.audioContext.currentTime) * 1000;
                
                this.chordTimeout = setTimeout(() => {
                    if (this.isPlaying) {
                        playChord();
                    }
                }, Math.max(0, delay));
            };
            
            // Start playing
            playChord();
            
            // Add a subtle bass line
            this.playBassLine();
            
        } catch (e) {
            console.warn('Error playing music:', e);
            this.isPlaying = false;
        }
    }
    
    playBassLine() {
        if (!this.audioContext) return;
        
        const bassNotes = [110, 87.31, 130.81, 98]; // A, F, C, G (one octave lower)
        let noteIndex = 0;
        const noteDuration = 2.0; // Match chord duration
        
        const playBass = () => {
            if (!this.isPlaying) return;
            
            const currentTime = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine'; // Smooth bass
            oscillator.frequency.value = bassNotes[noteIndex];
            
            // Soft envelope
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.08, currentTime + 0.2);
            gainNode.gain.linearRampToValueAtTime(0.08, currentTime + noteDuration - 0.2);
            gainNode.gain.linearRampToValueAtTime(0, currentTime + noteDuration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.musicGainNode);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + noteDuration);
            
            this.musicOscillators.push(oscillator);
            
            noteIndex = (noteIndex + 1) % bassNotes.length;
            
            const nextNoteTime = currentTime + noteDuration;
            const delay = (nextNoteTime - this.audioContext.currentTime) * 1000;
            
            this.bassTimeout = setTimeout(() => {
                if (this.isPlaying) {
                    playBass();
                }
            }, Math.max(0, delay));
        };
        
        // Start after a short delay
        setTimeout(playBass, 200);
    }
    
    stopMusic() {
        this.isPlaying = false;
        
        // Clear timeouts
        if (this.chordTimeout) {
            clearTimeout(this.chordTimeout);
            this.chordTimeout = null;
        }
        if (this.bassTimeout) {
            clearTimeout(this.bassTimeout);
            this.bassTimeout = null;
        }
        
        // Stop oscillators
        if (this.musicOscillators) {
            this.musicOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {}
            });
            this.musicOscillators = [];
        }
        
        // Stop external audio if playing
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.volume;
        }
    }
    
    // Play collection sound effect
    playCollectionSound() {
        if (!this.audioContext) {
            // Try to initialize if not ready
            this.initAudio();
            if (!this.audioContext) return;
        }
        
        try {
            // Resume if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this.playCollectionSoundInternal();
                }).catch(e => {
                    console.warn('Could not resume audio context:', e);
                });
            } else {
                this.playCollectionSoundInternal();
            }
        } catch (e) {
            console.warn('Error playing collection sound:', e);
        }
    }
    
    playCollectionSoundInternal() {
        const currentTime = this.audioContext.currentTime;
        
        // Create a pleasant, more noticeable collection sound (ascending notes)
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G (major chord)
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            // More noticeable volume and longer duration
            const startTime = currentTime + (index * 0.05);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.05); // Louder
            gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5); // Longer
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.5);
        });
        
        // Add a subtle "ding" at the end for extra feedback
        const dingOsc = this.audioContext.createOscillator();
        const dingGain = this.audioContext.createGain();
        
        dingOsc.type = 'sine';
        dingOsc.frequency.value = 880; // A5 - pleasant high note
        
        dingGain.gain.setValueAtTime(0, currentTime + 0.15);
        dingGain.gain.linearRampToValueAtTime(0.4, currentTime + 0.2);
        dingGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
        
        dingOsc.connect(dingGain);
        dingGain.connect(this.audioContext.destination);
        
        dingOsc.start(currentTime + 0.15);
        dingOsc.stop(currentTime + 0.4);
    }
    
    // Play interaction sound effect
    playInteractionSound() {
        if (!this.audioContext) return;
        
        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const currentTime = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Soft bell-like sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, currentTime); // A5
            oscillator.frequency.exponentialRampToValueAtTime(1320, currentTime + 0.2); // E6
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.25, currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.4);
        } catch (e) {
            console.warn('Error playing interaction sound:', e);
        }
    }
    
    // Alternative: Load and play an external music file
    playMusicFile(url, loop = true) {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Stop generated music if playing
        this.stopMusic();
        
        // Create audio element for external file
        const audio = new Audio(url);
        audio.loop = loop;
        audio.volume = this.volume;
        
        audio.play().catch(e => {
            console.warn('Could not play music file:', e);
            // Fallback to generated music
            this.playLofiMusic();
        });
        
        this.currentAudio = audio;
        this.isPlaying = true;
    }
}
