// ============== Frontend JavaScript for LOGOforge ==============

// Global State
const state = {
    mode: 'manual', // 'manual' or 'ai'
    apiBase: 'http://localhost:8000/api',
    currentMode: 'manual',
    
    // Manual Designer State
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
    shapes: [],
    
    // AI State
    aiPrompt: '',
    aiGenerating: ,
    aiLogos: []
};

// ============== Manual Designer ==============

const canvas = document.getElementById('logoCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas) {
    canvas.style.display = 'none';
    setTimeout(() => {
        updateCanvas();
        canvas.style.display = 'block';
    }, 500);
}

// Manual Designer Event Listeners
function setupManualDesignerListeners() {
    const textInput = document.getElementById('textInput');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const textColor = document.getElementById('textColor');
    const bgColor = document.getElementById('bgColor');
    const bgColor2 = document.getElementById('bgColor2');
    const bgStyle = document.getElementById('bgStyle');
    const shapeColor = document.getElementById('shapeColor');
    const shapeSize = document.getElementById('shapeSize');
    const shapeRotation = document.getElementById('shapeRotation');
    const opacity = document.getElementById('opacity');
    const shadowToggle = document.getElementById('shadowToggle');

    if (textInput) {
        textInput.addEventListener('input', (e) => {
            state.text = e.target.value || 'LOGOforge';
            debounceUpdate();
        });
    }

    if (fontSize) {
        fontSize.addEventListener('input', (e) => {
            state.fontSize = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = state.fontSize;
            debounceUpdate();
        });
    }

    if (fontFamily) {
        fontFamily.addEventListener('change', (e) => {
            state.fontFamily = e.target.value;
            debounceUpdate();
        });
    }

    if (textColor) {
        textColor.addEventListener('input', (e) => {
            state.textColor = e.target.value;
            debounceUpdate();
        });
    }

    if (bgColor) {
        bgColor.addEventListener('input', (e) => {
            state.bgColor = e.target.value;
            debounceUpdate();
        });
    }

    if (bgColor2) {
        bgColor2.addEventListener('input', (e) => {
            state.bgColor2 = e.target.value;
            debounceUpdate();
        });
    }

    if (bgStyle) {
        bgStyle.addEventListener('change', (e) => {
            state.bgStyle = e.target.value;
            updateBackground();
        });
    }

    if (shapeColor) {
        shapeColor.addEventListener('input', (e) => {
            state.shapeColor = e.target.value;
            debounceUpdate();
        });
    }

    if (shapeSize) {
        shapeSize.addEventListener('input', (e) => {
            state.shapeSize = parseInt(e.target.value);
            document.getElementById('shapeSizeValue').textContent = state.shapeSize;
            debounceUpdate();
        });
    }

    if (shapeRotation) {
        shapeRotation.addEventListener('input', (e) => {
            state.shapeRotation = parseInt(e.target.value);
            document.getElementById('shapeRotationValue').textContent = state.shapeRotation;
            debounceUpdate();
        });
    }

    if (opacity) {
        opacity.addEventListener('input', (e) => {
            state.opacity = parseInt(e.target.value);
            document.getElementById('opacityValue').textContent = state.opacity;
            debounceUpdate();
        });
    }

    if (shadowToggle) {
        shadowToggle.addEventListener('change', (e) => {
            state.shadow = e.target.checked;
            debounceUpdate();
        });
    }
}

let updateTimeout;
function debounceUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updateCanvas();
    }, 100);
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
    if (!ctx || !canvas) return;
    
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
    if (!ctx || !canvas || state.shapes.length === 0) return;
    
    ctx.globalAlpha = state.opacity / 100;
    ctx.fillStyle = state.shapeColor;
    
    const size = state.shapeSize;
    const x = canvas.width / 2;
    const y = canvas.height / 2.5;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((state.shapeRotation * Math.PI) / 180);
    
    if (state.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    }
    
    if (state.shapes.includes('circle')) {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (state.shapes.includes('square')) {
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }
    
    if (state.shapes.includes('triangle')) {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
    }
    
    if (state.shapes.includes('star')) {
        drawStar(0, 0, 5, size / 2, size / 4);
    }
    
    ctx.shadowColor = 'transparent';
    ctx.restore();
    ctx.globalAlpha = 1;
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    if (!ctx) return;
    
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
    if (!ctx || !canvas) return;
    
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
    ctx.shadowColor = 'transparent';
    ctx.globalAlpha = 1;
}

function updateCanvas() {
    if (!ctx || !canvas) return;
    
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
    state.shapes = [];
    
    // Reset inputs
    if (document.getElementById('textInput')) {
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
    }
    
    updateCanvas();
}

function downloadLogo() {
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = 'logoforge-manual-' + Date.now() + '.png';
    link.click();
    showNotification('✅ Logo downloaded successfully!');
}

// ============== AI Logo Generator ==============

async function generateAILogo() {
    const prompt = document.getElementById('aiPrompt').value.trim();
    const style = document.getElementById('logoStyle').value;
    const industry = document.getElementById('logoIndustry').value;
    const color = document.getElementById('colorPreference').value;

    if (!prompt) {
        showNotification('❌ Please describe your logo idea!', 'error');
        return;
    }

    if (prompt.length > 500) {
        showNotification('❌ Prompt too long (max 500 characters)', 'error');
        return;
    }

    // Show loading state
    document.getElementById('aiLoadingState').style.display = 'flex';
    document.getElementById('aiResultsContainer').style.display = 'none';
    document.getElementById('aiErrorState').style.display = 'none';

    const btn = document.querySelector('.btn-generate');
    if (btn) {
        btn.disabled = true;
        document.getElementById('generateBtnText').style.display = 'none';
        document.getElementById('generatingLoader').style.display = 'inline';
    }

    try {
        const response = await fetch(`${state.apiBase}/generate-ai-logo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                style: style,
                industry: industry,
                color: color
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to generate logo');
        }

        // Display logo
        const imgElement = document.getElementById('aiGeneratedLogo');
        if (imgElement) {
            imgElement.src = data.imageUrl || data.logo.url;
        }

        document.getElementById('promptUsed').textContent = prompt;
        document.getElementById('aiLoadingState').style.display = 'none';
        document.getElementById('aiResultsContainer').style.display = 'block';

        showNotification('✨ Logo generated successfully!');
        
        // Add to gallery
        loadAILogos();

    } catch (error) {
        console.error('❌ Error:', error);
        document.getElementById('aiLoadingState').style.display = 'none';
        document.getElementById('aiErrorState').style.display = 'block';
        document.getElementById('errorMessage').textContent = `❌ ${error.message}`;
        showNotification(`Error: ${error.message}`, 'error');

    } finally {
        if (btn) {
            btn.disabled = false;
            document.getElementById('generateBtnText').style.display = 'inline';
            document.getElementById('generatingLoader').style.display = 'none';
        }
    }
}

async function downloadAILogo() {
    const img = document.getElementById('aiGeneratedLogo');
    if (!img || !img.src) return;

    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'logoforge-ai-' + Date.now() + '.png';
    link.click();
    showNotification('✅ AI Logo downloaded successfully!');
}

async function loadAILogos() {
    try {
        const response = await fetch(`${state.apiBase}/logos?type=ai&limit=9`);
        const data = await response.json();

        if (data.success) {
            const gallery = document.getElementById('logoGallery');
            if (gallery) {
                gallery.innerHTML = data.logos.map(logo => `
                    <div class="gallery-item">
                        <img src="${logo.url}" alt="Logo" class="gallery-image">
                        <div class="gallery-info">
                            <p>${logo.prompt.substring(0, 30)}...</p>
                            <small>${new Date(logo.createdAt).toLocaleDateString()}</small>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// ============== Mode Switching ==============

function switchMode(mode) {
    state.currentMode = mode;
    
    document.querySelectorAll('.mode-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.mode-btn').forEach(el => el.classList.remove('active'));
    
    if (mode === 'manual') {
        document.getElementById('manualSection').classList.add('active');
        document.querySelector('.mode-btn:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('aiSection').classList.add('active');
        document.querySelector('.mode-btn:nth-child(2)').classList.add('active');
        loadAILogos();
    }
}

// ============== Utilities ==============

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
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

    .spinner {
        border: 4px solid rgba(102, 126, 234, 0.2);
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Character counter for AI prompt
const aiPrompt = document.getElementById('aiPrompt');
if (aiPrompt) {
    aiPrompt.addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = e.target.value.length;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupManualDesignerListeners();
    if (ctx && canvas) {
        updateCanvas();
    }
});

// Check API connection
fetch(state.apiBase + '/health').catch(() => {
    console.warn
});
