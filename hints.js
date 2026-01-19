// Hint System - Shows helpful hints to guide players
class HintSystem {
    constructor(scene) {
        this.scene = scene;
        this.hintBox = null;
        this.currentHint = null;
        this.hintTimer = null;
        this.hintDelay = 10000; // Show hint after 10 seconds of inactivity
        this.lastActionTime = Date.now();
    }
    
    createHintBox() {
        if (this.hintBox) return;
        
        // Create hint box UI element
        const hintBoxElement = document.createElement('div');
        hintBoxElement.id = 'hint-box';
        hintBoxElement.className = 'hint-box hidden';
        hintBoxElement.innerHTML = `
            <div class="hint-icon">💡</div>
            <div class="hint-text"></div>
        `;
        document.body.appendChild(hintBoxElement);
        
        this.hintBox = hintBoxElement;
        this.hintText = hintBoxElement.querySelector('.hint-text');
    }
    
    showHint(text, duration = 5000) {
        if (!this.hintBox) this.createHintBox();
        
        this.currentHint = text;
        this.hintText.textContent = text;
        this.hintBox.classList.remove('hidden');
        
        // Auto-hide after duration
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
        }
        
        this.hintTimer = setTimeout(() => {
            this.hideHint();
        }, duration);
    }
    
    hideHint() {
        if (this.hintBox) {
            this.hintBox.classList.add('hidden');
        }
        this.currentHint = null;
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
    }
    
    updateAction() {
        this.lastActionTime = Date.now();
    }
    
    checkForStuckPlayer(condition, hintText) {
        // Check if player seems stuck (no action for a while)
        const timeSinceAction = Date.now() - this.lastActionTime;
        if (timeSinceAction > this.hintDelay && condition) {
            if (!this.currentHint) {
                this.showHint(hintText, 8000);
            }
        }
    }
    
    destroy() {
        this.hideHint();
        if (this.hintBox && this.hintBox.parentNode) {
            this.hintBox.parentNode.removeChild(this.hintBox);
        }
    }
}

// Hint messages for each level
const LevelHints = {
    level1: {
        initial: "Walk around and collect the glowing memories!",
        memory: "Get close to a memory and press ❤️ to collect it",
        lia: "Follow Lia's barks - she knows where the memories are!",
        stuck: "Move with the arrow buttons and collect all 3 memories"
    },
    level2: {
        initial: "Walk forward with Parth and interact at special moments",
        interact: "Press ❤️ when you see interaction points",
        bench: "Sit on the benches together",
        stuck: "Keep walking and look for places to interact with ❤️"
    },
    level3: {
        initial: "Choose the right path - follow Lia's guidance",
        path: "Lia will bark near the correct path",
        interact: "Press ❤️ when you reach a path to choose it",
        stuck: "Follow Lia - she knows which path is correct!"
    },
    level4: {
        initial: "Walk together to the glowing spot on the hilltop",
        proposal: "Press ❤️ at the special spot ahead",
        stuck: "Keep walking forward to reach the proposal point"
    }
};
