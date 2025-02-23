class MessageManager {
    constructor() {
        this.displayMessages = [];
        this.isLoaded = false;
        this.lastMessageTime = 0;
        this.maxAttempts = 15;
        
        // Cache for message widths
        this.messageCache = new Map();
        
        // Performance tracking
        this.lastCleanup = 0;
        this.cleanupInterval = 5000;
        this.lastPerformanceCheck = 0;
        this.performanceCheckInterval = 1000;
        this.lowPerformanceMode = false;
    }

    loadMessages(data) {
        if (!data.messages || !Array.isArray(data.messages)) {
            console.error('Invalid data format');
            return;
        }
        this.messageData = data.messages;
        this.totalMessages = this.messageData.length;
        this.isLoaded = true;
    }

    clearCache() {
        this.messageCache.clear();
    }

    getRandomMessage() {
        const index = Math.floor(random(this.totalMessages));
        const message = this.messageData[index].message;
        
        // Calculate width using current text size
        push();
        textSize(window.currentTextSize || 16);
        const width = textWidth(message);
        pop();
        
        return { message, width };
    }

    checkOverlap(x, y, messageWidth) {
        const fontSize = window.currentTextSize || 16;
        const margin = fontSize * 0.1; // Increased margin for better spacing
        const box = {
            left: x - messageWidth/2 - margin,
            right: x + messageWidth/2 + margin,
            top: y - fontSize - margin,
            bottom: y + fontSize + margin
        };

        // Quick check for screen bounds
        if (box.left < 0 || box.right > width || box.top < 0 || box.bottom > height) {
            return true;
        }

        for (const msg of this.displayMessages) {
            if (!msg.isVisible) continue;
            
            const msgBox = {
                left: msg.x - msg.totalWidth/2 - margin,
                right: msg.x + msg.totalWidth/2 + margin,
                top: msg.y - fontSize - margin,
                bottom: msg.y + fontSize + margin
            };

            if (!(box.right < msgBox.left || 
                  box.left > msgBox.right || 
                  box.bottom < msgBox.top || 
                  box.top > msgBox.bottom)) {
                return true;
            }
        }
        return false;
    }

    createNewMessage() {
        if (this.lowPerformanceMode) {
            return false;
        }

        const fontSize = window.currentTextSize || 16;
        const margin = fontSize * 3; // Increased margin for better spacing
        const messageData = this.getRandomMessage();
        
        // Try to place message in quadrants
        const quadrants = [
            [margin, width/2, margin, height/2],
            [width/2, width-margin, margin, height/2],
            [margin, width/2, height/2, height-margin],
            [width/2, width-margin, height/2, height-margin]
        ];

        for (const [x1, x2, y1, y2] of quadrants) {
            for (let i = 0; i < this.maxAttempts/4; i++) {
                const x = random(x1, x2);
                const y = random(y1, y2);

                if (!this.checkOverlap(x, y, messageData.width)) {
                    const textMessage = new TextMessage(messageData.message, x, y);
                    this.displayMessages.push(textMessage);
                    return true;
                }
            }
        }
        return false;
    }

    cleanupMessages() {
        const now = millis();
        this.displayMessages = this.displayMessages.filter(msg => {
            const keep = msg.isVisible && (now - msg.birth < msg.lifetime);
            if (!keep) {
                msg.cleanup();
            }
            return keep;
        });
    }

    checkPerformance() {
        const now = millis();
        if (now - this.lastPerformanceCheck > this.performanceCheckInterval) {
            const fps = frameRate();
            this.lowPerformanceMode = fps < 30;
            
            const maxMessages = window.maxMessages || 15;
            if (this.lowPerformanceMode) {
                while (this.displayMessages.length > maxMessages/2) {
                    const msg = this.displayMessages.shift();
                    if (msg) msg.cleanup();
                }
            }
            
            this.lastPerformanceCheck = now;
        }
    }

    update() {
        const now = millis();
        
        this.checkPerformance();
        
        if (now - this.lastCleanup > this.cleanupInterval) {
            this.cleanupMessages();
            this.lastCleanup = now;
        }

        const maxMessages = window.maxMessages || 15;
        const messageInterval = window.messageInterval || 1000;
        
        if (!this.lowPerformanceMode && 
            now - this.lastMessageTime > messageInterval && 
            this.displayMessages.length < maxMessages) {
            if (this.createNewMessage()) {
                this.lastMessageTime = now;
            }
        }

        for (const msg of this.displayMessages) {
            if (msg.isVisible) {
                msg.update();
            }
        }
    }

    display() {
        for (const msg of this.displayMessages) {
            if (msg.isVisible) {
                msg.display();
            }
        }
    }

    getMessageCount() {
        return this.totalMessages;
    }
}
