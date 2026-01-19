// Dialogue System
class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogueBox = document.getElementById('dialogue-box');
        this.speakerName = this.dialogueBox.querySelector('.speaker-name');
        this.dialogueText = this.dialogueBox.querySelector('.dialogue-text');
        this.isShowing = false;
        this.currentDialogue = null;
        this.onComplete = null;
        
        // Make dialogue box clickable
        this.dialogueBox.addEventListener('click', () => this.advance());
    }
    
    show(speaker, text, onComplete = null) {
        this.isShowing = true;
        this.speakerName.textContent = speaker;
        this.dialogueText.textContent = text;
        this.dialogueBox.classList.remove('hidden');
        this.onComplete = onComplete;
        this.currentDialogue = { speaker, text };
    }
    
    showSequence(dialogues, onComplete = null) {
        if (!dialogues || dialogues.length === 0) {
            if (onComplete) onComplete();
            return;
        }
        
        let index = 0;
        const showNext = () => {
            if (index >= dialogues.length) {
                this.hide();
                if (onComplete) onComplete();
                return;
            }
            
            const dialogue = dialogues[index];
            const speaker = dialogue.speaker || 'Mahika';
            this.show(speaker, dialogue.text, () => {
                index++;
                showNext();
            });
        };
        
        showNext();
    }
    
    advance() {
        if (this.onComplete) {
            const callback = this.onComplete;
            this.onComplete = null;
            callback();
        }
    }
    
    hide() {
        this.isShowing = false;
        this.dialogueBox.classList.add('hidden');
        this.onComplete = null;
    }
    
    showRandomIdle(idleDialogues) {
        if (!idleDialogues || idleDialogues.length === 0) return;
        const randomText = idleDialogues[Math.floor(Math.random() * idleDialogues.length)];
        this.show('Mahika', randomText, () => {
            setTimeout(() => this.hide(), 3000);
        });
    }
}
