// Configuration
const MAX_BUBBLES = 50;
const SPAWN_RADIUS = 100;
const PAUSE_DISTANCE = window.innerHeight;

// Text content and colors
const texts = [
    "A small space for experiments in art and code. Nothing fancy, just bits of my work and thoughts all in one place.",
    "Imagination, fantasy, dream and code.",
    "In the dance of electrons and the whisper of leaves, we find our place in nature's grand design.",
    "Curiosity is our compass, leading us through the maze of knowledge and wonder.",
    "Art is the language of the soul, code is the poetry of logic, together they create new worlds.",
    "In the quiet spaces between thoughts, we discover the beauty of existence.",
    "Nature's patterns echo in our minds, from the spiral of galaxies to the rhythm of our hearts.",
    "Love is the algorithm that makes us human, connecting us across the digital and physical realms.",
    "The future is not written in stone, but in the choices we make today.",
    "In the garden of ideas, diversity blooms and wisdom grows.",
    "Cryptography is the art of secrets, revealing the beauty of mathematics in everyday life.",
    "The universe speaks in patterns, and we are its curious listeners.",
    "Technology should serve life, not the other way around.",
    "In the intersection of art and science, we find the poetry of reality.",
    "Every line of code is a brushstroke in the canvas of possibility.",
    "The best solutions come from understanding, not from force.",
    "Nature's wisdom is written in the language of mathematics.",
    "In the silence between words, we find the space to think and grow.",
    "The digital and natural worlds are not separate, but different expressions of the same reality.",
    "Knowledge is a garden that grows through sharing and collaboration."
];

// Color palette for text transitions
const colors = [
    '#00ff00', '#ff0000', '#00ffff', '#ff00ff', '#ffff00',
    '#ff8800', '#88ff00', '#00ff88', '#0088ff', '#8800ff',
    '#ff0088', '#88ff88', '#ff8888', '#8888ff', '#ff88ff',
    '#ffff88', '#88ffff', '#ffaa00', '#00ffaa', '#aa00ff'
];

// State variables
let currentTextIndex = 0;
let currentIndex = 0;
let indicesToChange = [];

// Initialize text display
const transitionText = document.getElementById('transition-text');
const maxLength = Math.max(...texts.map(text => text.length));
const paddedTexts = texts.map(text => text.padEnd(maxLength, ' '));

// Background animation using p5.js
const sketch = (p) => {
    let bubbles = [];
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let isMouseMoving = false;

    class Bubble {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = p.random(20, 100);
            this.targetSize = this.size;
            this.hue = this.getContrastingHue(colors[currentTextIndex]);
            this.hueSpeed = p.random(-0.5, 0.5);
            this.opacity = p.random(0.1, 0.3);
            this.velocity = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
            this.acceleration = p.createVector(0, 0);
            this.maxSpeed = 2;
            this.phase = p.random(p.PI * 2);
            this.lifetime = p.random(300, 600);
            this.age = 0;
            this.bonds = [];
            this.bondCount = p.floor(p.random(1, 4));
            this.vertices = this.calculateVertices(window.scrollY / (window.innerHeight * 2));
            this.rotation = p.random(p.PI * 2);
            this.rotationSpeed = p.random(-0.02, 0.02);
            this.vertexOffsets = this.generateVertexOffsets();
            this.angleOffsets = this.generateAngleOffsets();
            this.fluctuationSpeeds = this.generateFluctuationSpeeds();
            this.fluctuationPhases = this.generateFluctuationPhases();
        }

        generateFluctuationSpeeds() {
            return Array.from({length: this.vertices}, () => p.random(0.5, 2.0));
        }

        generateFluctuationPhases() {
            return Array.from({length: this.vertices}, () => p.random(p.TWO_PI));
        }

        calculateFluctuation(vertexIndex, time) {
            return p.sin(time * this.fluctuationSpeeds[vertexIndex] + this.fluctuationPhases[vertexIndex]);
        }

        calculateVertices(scrollProgress) {
            return Math.floor(3 + scrollProgress * 12);
        }

        generateVertexOffsets() {
            return Array.from({length: this.vertices}, () => p.random(0.7, 1.3));
        }

        generateAngleOffsets() {
            return Array.from({length: this.vertices}, () => p.random(-0.2, 0.2));
        }

        drawShape() {
            const size = this.size;
            const halfSize = size / 2;
            const time = p.frameCount * 0.02;

            if (this.vertices <= 3) {
                const fluctuation = p.sin(time + this.phase) * 0.1;
                p.circle(0, 0, size * (1 + fluctuation));
            } else {
                p.beginShape();
                const baseAngleStep = p.TWO_PI / this.vertices;
                
                for(let i = 0; i < this.vertices; i++) {
                    const baseAngle = i * baseAngleStep;
                    const angleOffset = this.angleOffsets[i];
                    const angleFluctuation = this.calculateFluctuation(i, time) * 0.2;
                    const angle = baseAngle + angleOffset + angleFluctuation + this.rotation;
                    
                    const radiusOffset = this.vertexOffsets[i];
                    const radiusFluctuation = this.calculateFluctuation(i, time) * 0.15;
                    const radius = halfSize * (radiusOffset + radiusFluctuation);
                    
                    p.vertex(p.cos(angle) * radius, p.sin(angle) * radius);
                }
                
                p.endShape(p.CLOSE);
            }
        }

        getContrastingHue(textColor) {
            const r = parseInt(textColor.slice(1, 3), 16);
            const g = parseInt(textColor.slice(3, 5), 16);
            const b = parseInt(textColor.slice(5, 7), 16);
            const [h, s, l] = this.rgbToHsl(r, g, b);
            let contrastingHue = (h + 180 + p.random(-30, 30)) % 360;
            return contrastingHue;
        }

        rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h *= 60;
            }
            
            return [h, s * 100, l * 100];
        }

        update() {
            this.age++;
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.maxSpeed);
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.rotation += this.rotationSpeed;
            
            if (this.x < 0 || this.x > p.width) this.velocity.x *= -1;
            if (this.y < 0 || this.y > p.height) this.velocity.y *= -1;
            
            this.size += (this.targetSize - this.size) * 0.05;
            if (p.frameCount % 60 === 0) {
                this.targetSize = p.random(20, 150);
            }
            
            this.hue = (this.hue + this.hueSpeed) % 360;
            this.acceleration = p.createVector(
                p.sin(time * 0.001 + this.phase) * 0.1,
                p.cos(time * 0.001 + this.phase) * 0.1
            );
            
            this.updateBonds();
        }

        updateBonds() {
            this.bonds = bubbles
                .filter(other => other !== this)
                .sort((a, b) => {
                    let distA = p.dist(this.x, this.y, a.x, a.y);
                    let distB = p.dist(this.x, this.y, b.x, b.y);
                    return distA - distB;
                })
                .slice(0, this.bondCount)
                .map(bubble => ({
                    x: bubble.x,
                    y: bubble.y
                }));
        }

        draw() {
            const fadeOut = this.age > this.lifetime * 0.7 ? 
                1 - (this.age - this.lifetime * 0.7) / (this.lifetime * 0.3) : 1;
            
            p.push();
            p.translate(this.x, this.y);
            
            this.bonds.forEach(bond => {
                p.stroke(this.hue, 80, 100, this.opacity * 0.3 * fadeOut);
                p.strokeWeight(2);
                p.line(0, 0, bond.x - this.x, bond.y - this.y);
            });
            
            p.noStroke();
            p.fill(this.hue, 80, 100, this.opacity * fadeOut);
            this.drawShape();
            
            p.fill(255, 255, 255, this.opacity * 0.3 * fadeOut);
            p.circle(-this.size * 0.2, -this.size * 0.2, this.size * 0.3);
            
            p.pop();
        }

        isDead() {
            return this.age >= this.lifetime;
        }
    }

    p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('background-canvas');
        p.colorMode(p.HSB, 360, 100, 100, 1);
    };

    p.draw = () => {
        p.background(0, 0, 0, 0.1);
        
        bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });
        
        bubbles = bubbles.filter(bubble => !bubble.isDead());
        
        if (bubbles.length < MAX_BUBBLES) {
            if (isMouseMoving) {
                const angle = p.random(p.TWO_PI);
                const distance = p.random(SPAWN_RADIUS);
                const x = mouseX + p.cos(angle) * distance;
                const y = mouseY + p.sin(angle) * distance;
                bubbles.push(new Bubble(x, y));
            } else {
                bubbles.push(new Bubble(
                    p.random(p.width),
                    p.random(p.height)
                ));
            }
        }
        
        time++;
    };

    p.mouseMoved = () => {
        if (p.mouseX !== prevMouseX || p.mouseY !== prevMouseY) {
            isMouseMoving = true;
            mouseX = p.mouseX;
            mouseY = p.mouseY;
            prevMouseX = p.mouseX;
            prevMouseY = p.mouseY;
        } else {
            isMouseMoving = false;
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

// Initialize p5.js sketch
new p5(sketch);

// Text transition functions
function updateText() {
    const currentText = paddedTexts[currentTextIndex];
    const nextText = paddedTexts[(currentTextIndex + 1) % paddedTexts.length];
    let htmlResult = '';
    
    for (let i = 0; i < currentText.length; i++) {
        const pos = i;
        const isChanged = indicesToChange.indexOf(pos) < currentIndex;
        
        if (isChanged) {
            htmlResult += `<span style="color: ${colors[(currentTextIndex + 1) % colors.length]}">${nextText[pos]}</span>`;
        } else {
            htmlResult += `<span style="color: ${colors[currentTextIndex]}">${currentText[pos]}</span>`;
        }
    }
    
    return htmlResult;
}

function initializeIndicesToChange() {
    indicesToChange = Array.from({length: maxLength}, (_, i) => i);
    for (let i = indicesToChange.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indicesToChange[i], indicesToChange[j]] = [indicesToChange[j], indicesToChange[i]];
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    const maxScrollDistance = window.innerHeight;
    const totalScrollNeeded = maxScrollDistance + PAUSE_DISTANCE;
    const transitionScroll = scrollY % totalScrollNeeded;
    
    if (transitionScroll < PAUSE_DISTANCE) {
        currentIndex = 0;
    } else {
        const transitionProgress = Math.min(
            (transitionScroll - PAUSE_DISTANCE) / (maxScrollDistance / maxLength),
            maxLength
        );
        currentIndex = Math.floor(transitionProgress);
    }
    
    const targetTextIndex = Math.floor(scrollY / totalScrollNeeded);
    
    if (targetTextIndex !== currentTextIndex) {
        currentTextIndex = targetTextIndex % paddedTexts.length;
        currentIndex = 0;
        initializeIndicesToChange();
        history.replaceState(null, null, `#${currentTextIndex + 1}`);
    }
    
    currentIndex = Math.min(currentIndex, maxLength);
    transitionText.innerHTML = updateText();
}

function handleHash() {
    const hash = window.location.hash;
    if (hash) {
        const match = hash.match(/#(\d+)/);
        if (match) {
            const targetIndex = parseInt(match[1]) - 1;
            if (targetIndex >= 0 && targetIndex < paddedTexts.length) {
                const viewportHeight = window.innerHeight;
                const scrollPosition = targetIndex * (viewportHeight * 2);
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant'
                });
                
                currentTextIndex = targetIndex;
                currentIndex = 0;
                initializeIndicesToChange();
                transitionText.innerHTML = `<span style="color: ${colors[currentTextIndex]}">${paddedTexts[currentTextIndex]}</span>`;
            }
        }
    }
}

// Initialize text and event listeners
currentTextIndex = 0;
currentIndex = 0;
transitionText.innerHTML = `<span style="color: ${colors[0]}">${paddedTexts[0]}</span>`;
initializeIndicesToChange();

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleHash);
window.addEventListener('hashchange', handleHash);

document.body.style.minHeight = `${paddedTexts.length * window.innerHeight * 2}px`; 