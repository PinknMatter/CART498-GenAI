class TextMessage {
    constructor(message, x, y) {
        this.message = message;
        this.x = x;
        this.y = y;
        this.birth = millis();
        this.lifetime = random(8000, 12000);
        this.isVisible = true;
        this.currentChar = 0;
        this.charSpeed = 0.5;
        this.lastBlinkTime = millis();
        this.cursorVisible = true;
        this.blinkRate = 500;
        this.highlightedWords = new Map(); // Map to store highlighted word indices and their start times
        this.highlightDuration = window.highlightDuration || 3000; // 3 seconds
        this.maxHighlights = window.maxHighlights || 5; // Maximum number of highlighted words
        this.processWords();
    }

    processWords() {
        let words = this.message.split(' ');
        this.words = words;
        
        // Calculate total width with current text size
        push();
        textSize(window.currentTextSize || 16);
        this.totalWidth = textWidth(this.message);
        pop();
    }

    updateHighlights() {
        const currentTime = millis();
        
        // Remove expired highlights
        for (const [index, startTime] of this.highlightedWords.entries()) {
            if (currentTime - startTime > (window.highlightDuration || 3000)) {
                this.highlightedWords.delete(index);
            }
        }

        // Add new highlights if we have fewer than max
        if (this.highlightedWords.size < (window.maxHighlights || 5) && random(1) < 0.1) { // 10% chance each frame
            const availableIndices = Array.from(Array(this.words.length).keys())
                .filter(i => !this.highlightedWords.has(i));
            
            if (availableIndices.length > 0) {
                const randomIndex = availableIndices[floor(random(availableIndices.length))];
                this.highlightedWords.set(randomIndex, currentTime);
            }
        }
    }

    cleanup() {
        this.isVisible = false;
    }

    update() {
        if (!this.isVisible) return;

        // Update character count
        this.currentChar = min(this.message.length, 
            this.currentChar + this.charSpeed);

        // Update cursor blink
        if (millis() - this.lastBlinkTime > this.blinkRate) {
            this.cursorVisible = !this.cursorVisible;
            this.lastBlinkTime = millis();
        }

        // Update highlights
        this.updateHighlights();

        // Check if lifetime is exceeded
        if (millis() - this.birth > this.lifetime) {
            this.cleanup();
        }

        // Recalculate width if text size changed
        push();
        textSize(window.currentTextSize || 16);
        this.totalWidth = textWidth(this.message);
        pop();
    }

    display() {
        if (!this.isVisible) return;

        push();
        const fontSize = window.currentTextSize || 16;
        textSize(fontSize);
        
        // Split into visible and hidden parts
        const visibleText = this.message.substring(0, Math.floor(this.currentChar));
        const words = visibleText.split(' ');

        // Calculate positions
        const totalWidth = textWidth(this.message);
        const startX = this.x - totalWidth/2;
        let currentX = startX;

        // Draw each word
        textAlign(LEFT, CENTER);
        fill(0);
        noStroke(); // Remove borders from highlights
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const wordWidth = textWidth(word + ' ');

            // Check if this word is highlighted
            if (this.highlightedWords.has(i)) {
                fill(255, 255, 0, 150);
                rect(currentX, this.y - fontSize/2, wordWidth, fontSize);
                fill(0);
            }

            text(word + ' ', currentX, this.y);
            currentX += wordWidth;
        }

        // Draw cursor
        if (this.cursorVisible && this.currentChar < this.message.length) {
            const cursorX = startX + textWidth(visibleText);
            stroke(0);
            strokeWeight(max(1, fontSize/16));
            const cursorHeight = fontSize * 0.8;
            line(cursorX, 
                 this.y - cursorHeight/2,
                 cursorX, 
                 this.y + cursorHeight/2);
        }
        
        pop();
    }
}
