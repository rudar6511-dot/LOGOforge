// Canvas Setup
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// State Object
const state = {
    text: 'LOGOforge',
    fontSize: 40,
    fontFamily: 'Arial',
    textColor: '#000000',
    bgColor: '#ffffff',
    bgColor2: '#e74c3c',
    bgStyle: 'solid',
    shapeColor: '#3498db',
    shapeSize: 100,
    shapeRotation: 0,
    opacity: 100,
    shadow: false,
    border: false,
    borderColor: '#000000',
    shapes: []
};

// Event Listeners
document.getElementById('textInput').addEventListener('input', (e) => {
    state.text = e.target.value || 'LOGOforge';
    updateCanvas();
});

document.getElementById('fontSize').addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value);
    document.getElementById('fontSizeValue').textContent = state.fontSize;
    updateCanvas();
});

document.getElementById('fontFamily').addEventListener('change', (e) => {
    state.fontFamily = e.target.value;
    updateCanvas();
});

document.getElementById('textColor').addEventListener('input', (e) => {
    state.textColor = e.target.value;
    updateCanvas();
});

document.getElementById('bgColor').addEventListener('input', (e) => {
    state.bgColor = e.target.value;
    updateCanvas();
});

document.getElementById('bgColor2').addEventListener('input', (e) => {
    state.bgColor2 = e.target.value;
    updateCanvas();
});

document.getElementById('shapeColor').addEventListener('input', (e) => {
    state.shapeColor = e.target.value;
    updateCanvas();
});

document.getElementById('shapeSize').addEventListener('input', (e) => {
    state.shapeSize = parseInt(e.target.value);
    document.getElementById('shapeSizeValue').textContent = state.shapeSize;
    updateCanvas();
});

document.getElementById('shapeRotation').addEventListener('input', (e) => {
    state.shapeRotation = parseInt(e.target.value);
    document.getElementById('shapeRotationValue').textContent = state.shapeRotation;
    updateCanvas();
});

document.getElementById('opacity').addEventListener('input', (e) => {
    state.opacity = parseInt(e.target.value);
    document.getElementById('opacityValue').textContent = state.opacity;
    updateCanvas();
});

document.getElementById('shadowToggle').addEventListener('change', (e) => {
    state.shadow = e.target.checked;
    updateCanvas();
});

document.getElementById('borderToggle').addEventListener('change', (e) => {
    state.border = e.target.checked;
    updateCanvas();
});

document.getElementById('borderColor').addEventListener('input', (e) => {
    state.borderColor = e.target.value;
    updateCanvas();
});

// Draw Functions
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
    ctx.globalAlpha = state.opacity / 100;
    ctx.fillStyle = state.shapeColor;
    
    const size = state.shapeSize;
    const x = canvas.width / 2;
    const y = canvas.height / 2.5;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((state.shapeRotation * Math.PI) / 180);
    
    // Draw Circle
    if (state.shapes.includes('circle')) {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw Square
    if (state.shapes.includes('square')) {
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }
    
    // Draw Triangle
    if (state.shapes.includes('triangle')) {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw Star
    if (state.shapes.includes('star')) {
        drawStar(0, 0, 5, size / 2, size / 4);
    }
    
    // Draw Border
    if (state.border) {
        ctx.strokeStyle = state.borderColor;
        ctx.lineWidth = 3;
        if (state.shapes.includes('circle')) {
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (state.shapes.includes('square')) {
            ctx.strokeRect(-size / 2, -size / 2, size, size);
        }
        if (state.shapes.includes('triangle')) {
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(size / 2, size / 2);
            ctx.lineTo(-size / 2, size / 2);
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    // Draw Shadow
    if (state.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    }
    
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
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (state.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
    }
    
    ctx.fillText(state.text, canvas.width / 2, canvas.height - 80);
    
    if (state.border) {
        ctx.strokeStyle = state.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeText(state.text, canvas.width / 2, canvas.height - 80);
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

function resetCanvas() {
    state.text = 'LOGOforge';
    state.fontSize = 40;
    state.fontFamily = 'Arial';
    state.textColor = '#000000';
    state.bgColor = '#ffffff';
    state.bgColor2 = '#e74c3c';
    state.bgStyle = 'solid';
    state.shapeColor = '#3498db';
    state.shapeSize = 100;
    state.shapeRotation = 0;
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
    link.href = canvas.toDataURL('image/png');
    link.download = 'my-logo.png';
    link.click();
}

function downloadSVG() {
    alert('SVG export feature coming soon! For now, use the PNG download option.');
}

// Initialize Canvas
window.addEventListener('load', () => {
    updateCanvas();
});
fetch("https://api.stability.ai/v1/generate", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY" },
  body: JSON.stringify({ prompt: "Logo design" })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
