// Canvas Setup
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// State Object
const state = {
    text: 'LOGOforge',
    fontSize: 40,
    fontFamily: 'Arial',
    textColor: '#000000',
    textAlign: 'center',
    bgColor: '#ffffff',
    bgColor2: '#e74c3c',
    bgStyle: 'solid',
    shapeColor: '#3498db',
    shapeSize: 100,
    shapeRotation: 0,
    shapeX: 0,
    shapeY: 0,
    opacity: 100,
    shadow: false,
    border: false,
    borderColor: '#000000',
    shapes: [],
    history: []
};

// Prevent canvas from showing during initialization
canvas.style.display = 'none';

// Event Listeners
document.getElementById('textInput').addEventListener('input', (e) => {
    state.text = e.target.value || 'LOGOforge';
    debouncedUpdate();
});

document.getElementById('fontSize').addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value);
    document.getElementById('fontSizeValue').textContent = state.fontSize;
    debouncedUpdate();
});

document.getElementById('fontFamily').addEventListener('change', (e) => {
    state.fontFamily = e.target.value;
    debouncedUpdate();
});

document.getElementById('textColor').addEventListener('input', (e) => {
    state.textColor = e.target.value;
    debouncedUpdate();
});

document.getElementById('bgColor').addEventListener('input', (e) => {
    state.bgColor = e.target.value;
    debouncedUpdate();
});

document.getElementById('bgColor2').addEventListener('input', (e) => {
    state.bgColor2 = e.target.value;
    debouncedUpdate();
});

document.getElementById('shapeColor').addEventListener('input', (e) => {
    state.shapeColor = e.target.value;
    debouncedUpdate();
});

document.getElementById('shapeSize').addEventListener('input', (e) => {
    state.shapeSize = parseInt(e.target.value);
    document.getElementById('shapeSizeValue').textContent = state.shapeSize;
    debouncedUpdate();
});

document.getElementById('shapeRotation').addEventListener('input', (e) => {
    state.shapeRotation = parseInt(e.target.value);
    document.getElementById('shapeRotationValue').textContent = state.shapeRotation;
    debouncedUpdate();
});

document.getElementById('opacity').addEventListener('input', (e) => {
    state.opacity = parseInt(e.target.value);
    document.getElementById('opacityValue').textContent = state.opacity;
    debouncedUpdate();
});

document.getElementById('shadowToggle').addEventListener('change', (e) => {
    state.shadow = e.target.checked;
    debouncedUpdate();
});

document.getElementById('borderToggle').addEventListener('change', (e) => {
    state.border = e.target.checked;
    const borderColorLabel = document.getElementById('borderColorLabel');
    const borderColorInput = document.getElementById('borderColor');
    if (e.target.checked) {
        borderColorLabel.style.display = 'block';
        borderColorInput.style.display = 'block';
    } else {
        borderColorLabel.style.display = 'none';
        borderColorInput.style.display = 'none';
    }
    debouncedUpdate();
});

document.getElementById('borderColor').addEventListener('input', (e) => {
    state.borderColor = e.target.value;
    debouncedUpdate();
});

// Debounce function for performance
let updateTimeout;
function debouncedUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updateCanvas();
    }, 100);
}

// Functions
function setShapeColor(color) {
    state.shapeColor = color;
    document.getElementById('shapeColor').value = color;
    updateCanvas();
}

function setTextAlign(align) {
    state.textAlign = align;
    updateCanvas();
}

function moveShape(direction) {
    const step = 10;
    switch(direction) {
        case 'up':
            state.shapeY -= step;
            break;
        case 'down':
            state.shapeY += step;
            break;
        case 'left':
            state.shapeX -= step;
            break;
        case 'right':
            state.shapeX += step;
            break;
    }
    updateCanvas();
}

function updateBackground() {
    const bgStyle = document.getElementById('bgStyle').value;
    const bgColor2Label = document.getElementById('bgColor2Label');
    const bgColor2Input = document.getElementById('bgColor2');
    
    if (bgStyle === 'gradient') {
        bgColor2Label.style.display = 'block';
        bgColor2Input.style.display = 'block';
    } else {
        bgColor2Label.style.display = 'none';
        bgColor2Input.style.display = 'none';
    }
    state.bgStyle = bgStyle;
    updateCanvas();
}

function drawBackground() {
    if (state.bgStyle === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, state.bgColor);
        gradient.addColorStop(1, state.bgColor2);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = state.bgColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawShapes() {
    if (state.shapes.length === 0) return;
    
    ctx.globalAlpha = state.opacity / 100;
    ctx.fillStyle = state.shapeColor;
    
    const size = state.shapeSize;
    const x = (canvas.width / 2) + state.shapeX;
    const y = (canvas.height / 2.5) + state.shapeY;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((state.shapeRotation * Math.PI) / 180);
    
    // Apply shadow if enabled
    if (state.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    }
    
    // Draw Circle
    if (state.shapes.includes('circle')) {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        if (state.border) {
            ctx.strokeStyle = state.borderColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    
    // Draw Square
    if (state.shapes.includes('square')) {
        ctx.fillRect(-size / 2, -size / 2, size, size);
        
        if (state.border) {
            ctx.strokeStyle = state.borderColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(-size / 2, -size / 2, size, size);
        }
    }
    
    // Draw Triangle
    if (state.shapes.includes('triangle')) {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
        
        if (state.border) {
            ctx.strokeStyle = state.borderColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    
    // Draw Star
    if (state.shapes.includes('star')) {
        drawStar(0, 0, 5, size / 2, size / 4);
        
        if (state.border) {
            ctx.strokeStyle = state.borderColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    
    ctx.shadowColor = 'transparent';
    ctx.restore();
    ctx.globalAlpha = 1;
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function drawText() {
    ctx.globalAlpha = state.opacity / 100;
    ctx.fillStyle = state.textColor;
    ctx.font = `bold ${state.fontSize}px ${state.fontFamily}`;
    ctx.textAlign = state.textAlign;
    ctx.textBaseline = 'middle';
    
    if (state.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
    }
    
    const textX = state.textAlign === 'center' ? canvas.width / 2 : (state.textAlign === 'left' ? 50 : canvas.width - 50);
    ctx.fillText(state.text, textX, canvas.height - 80);
    
    if (state.border) {
        ctx.strokeStyle = state.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeText(state.text, textX, canvas.height - 80);
    }
    
    ctx.shadowColor = 'transparent';
    ctx.globalAlpha = 1;
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawShapes();
    drawText();
}

function addShape(shape) {
    if (!state.shapes.includes(shape)) {
        state.shapes.push(shape);
    } else {
        state.shapes = state.shapes.filter(s => s !== shape);
    }
    updateCanvas();
}

function applyTemplate(template) {
    switch(template) {
        case 'tech':
            state.text = 'TECH';
            state.fontSize = 50;
            state.fontFamily = 'Arial';
            state.textColor = '#ffffff';
            state.bgColor = '#001a4d';
            state.bgColor2 = '#0033cc';
            state.bgStyle = 'gradient';
            state.shapeColor = '#00ff00';
            state.shapes = ['circle'];
            state.shadow = true;
            break;
        case 'creative':
            state.text = 'CREATE';
            state.fontSize = 45;
            state.fontFamily = 'Georgia';
            state.textColor = '#d946ef';
            state.bgColor = '#fff8f0';
            state.bgColor2 = '#ffd700';
            state.bgStyle = 'gradient';
            state.shapeColor = '#ff69b4';
            state.shapes = ['star'];
            state.shadow = false;
            break;
        case 'modern':
            state.text = 'MODERN';
            state.fontSize = 48;
            state.fontFamily = 'Verdana';
            state.textColor = '#ffffff';
            state.bgColor = '#2c3e50';
            state.bgColor2 = '#3498db';
            state.bgStyle = 'gradient';
            state.shapeColor = '#e74c3c';
            state.shapes = ['square'];
            state.shadow = true;
            break;
    }
    
    // Update UI
    document.getElementById('textInput').value = state.text;
    document.getElementById('fontSize').value = state.fontSize;
    document.getElementById('fontSizeValue').textContent = state.fontSize;
    document.getElementById('fontFamily').value = state.fontFamily;
    document.getElementById('textColor').value = state.textColor;
    document.getElementById('bgColor').value = state.bgColor;
    document.getElementById('bgColor2').value = state.bgColor2;
    document.getElementById('bgStyle').value = state.bgStyle;
    document.getElementById('shapeColor').value = state.shapeColor;
    document.getElementById('shadowToggle').checked = state.shadow;
    
    if (state.bgStyle === 'gradient') {
        document.getElementById('bgColor2Label').style.display = 'block';
        document.getElementById('bgColor2').style.display = 'block';
    }
    
    updateCanvas();
}

function resetCanvas() {
    state.text = 'LOGOforge';
    state.fontSize = 40;
    state.fontFamily = 'Arial';
    state.textColor = '#000000';
    state.textAlign = 'center';
    state.bgColor = '#ffffff';
    state.bgColor2 = '#e74c3c';
    state.bgStyle = 'solid';
    state.shapeColor = '#3498db';
    state.shapeSize = 100;
    state.shapeRotation = 0;
    state.shapeX = 0;
    state.shapeY = 0;
    state.opacity = 100;
    state.shadow = false;
    state.border = false;
    state.shapes = [];
    
    // Reset all inputs
    document.getElementById('textInput').value = 'LOGOforge';
    document.getElementById('fontSize').value = 40;
    document.getElementById('fontSizeValue').textContent = '40';
    document.getElementById('fontFamily').value = 'Arial';
    document.getElementById('textColor').value = '#000000';
    document.getElementById('bgColor').value = '#ffffff';
    document.getElementById('bgColor2').value = '#e74c3c';
    document.getElementById('bgStyle').value = 'solid';
    document.getElementById('shapeColor').value = '#3498db';
    document.getElementById('shapeSize').value = 100;
    document.getElementById('shapeSizeValue').textContent = '100';
    document.getElementById('shapeRotation').value = 0;
    document.getElementById('shapeRotationValue').textContent = '0';
    document.getElementById('opacity').value = 100;
    document.getElementById('opacityValue').textContent = '100';
    document.getElementById('shadowToggle').checked = false;
    document.getElementById('borderToggle').checked = false;
    document.getElementById('borderColor').value = '#000000';
    document.getElementById('bgColor2Label').style.display = 'none';
    document.getElementById('bgColor2').style.display = 'none';
    
    updateCanvas();
}

function downloadLogo() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = 'logoforge-' + Date.now() + '.png';
    link.click();
    showNotification('✅ Logo downloaded successfully!');
}

function downloadSVG() {
    showNotification('🎉 SVG export feature coming in v2.0!');
}

function shareDesign() {
    const dataUrl = canvas.toDataURL('image/png');
    if (navigator.share) {
        navigator.share({
            title: 'Check out my LOGOforge design!',
            text: 'I created this amazing logo using LOGOforge',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        showNotification('📱 Download and share the PNG!');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;padding:15px 25px;border-radius:8px;z-index:9999;font-weight:600;animation:slideIn 0.3s ease-out;box-shadow:0 5px 15px rgba(102, 126, 234, 0.4);';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);

// Initialize Canvas after page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        updateCanvas();
        canvas.style.display = 'block';
    }, 500);
});