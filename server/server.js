// Backend Configuration
const CONFIG = {
    API_BASE: 'http://localhost:5000/api',
    STABILITY_AI_KEY: process.env.STABILITY_AI_KEY || '', // Will be set from backend
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/logoforge'
};

// ============== Express Server Setup ==============
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../logos');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `logo-${Date.now()}.png`);
    }
});

const upload = multer({ storage });

// In-memory database (for demo - use MongoDB in production)
const logoDatabase = {
    logos: [],
    users: [],
    analytics: {
        totalLogos: 0,
        aiLogos: 0,
        manualLogos: 0,
        activeUsers: 0
    }
};

// ============== Routes ==============

// 1. Generate AI Logo using Stability AI
app.post('/api/generate-ai-logo', async (req, res) => {
    try {
        const { prompt, style, industry, color } = req.body;

        // Enhance prompt
        let enhancedPrompt = `Professional logo design: ${prompt}`;
        if (style) enhancedPrompt += `, ${style} style`;
        if (industry) enhancedPrompt += `, for ${industry} industry`;
        if (color) enhancedPrompt += `, with ${color} colors`;
        enhancedPrompt += `. High quality, modern, professional, clean design, transparent background, PNG format`;

        console.log('📝 Enhanced Prompt:', enhancedPrompt);

        // Call Stability AI API
        const response = await axios.post(
            'https://api.stability.ai/v1/generation/stable-diffusion-3-large/text-to-image',
            {
                prompt: enhancedPrompt,
                output_format: 'png',
                negative_prompt: 'text, watermark, blurry, low quality, distorted'
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.STABILITY_AI_KEY}`,
                    'Accept': 'image/*'
                },
                responseType: 'arraybuffer'
            }
        );

        // Save logo to disk
        const logoId = `logo-${Date.now()}`;
        const logoPath = path.join(__dirname, '../logos', `${logoId}.png`);
        
        if (!fs.existsSync(path.join(__dirname, '../logos'))) {
            fs.mkdirSync(path.join(__dirname, '../logos'), { recursive: true });
        }
        
        fs.writeFileSync(logoPath, response.data);

        // Store in database
        const logoData = {
            id: logoId,
            type: 'ai',
            prompt: prompt,
            enhancedPrompt: enhancedPrompt,
            style: style,
            industry: industry,
            color: color,
            filePath: `/logos/${logoId}.png`,
            url: `/logos/${logoId}.png`,
            createdAt: new Date(),
            timestamp: Date.now(),
            size: response.data.length
        };

        logoDatabase.logos.push(logoData);
        logoDatabase.analytics.totalLogos++;
        logoDatabase.analytics.aiLogos++;

        res.json({
            success: true,
            message: 'Logo generated successfully',
            logo: logoData,
            imageUrl: `/logos/${logoId}.png`
        });

    } catch (error) {
        console.error('❌ AI Logo Generation Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate logo',
            message: error.message
        });
    }
});

// 2. Save Manual Logo
app.post('/api/save-manual-logo', upload.single('logo'), async (req, res) => {
    try {
        const { text, style, colors } = req.body;

        const logoId = `manual-${Date.now()}`;
        const logoData = {
            id: logoId,
            type: 'manual',
            text: text,
            style: JSON.parse(style),
            colors: JSON.parse(colors),
            filePath: `/logos/${req.file.filename}`,
            url: `/logos/${req.file.filename}`,
            createdAt: new Date(),
            timestamp: Date.now(),
            size: req.file.size
        };

        logoDatabase.logos.push(logoData);
        logoDatabase.analytics.totalLogos++;
        logoDatabase.analytics.manualLogos++;

        res.json({
            success: true,
            message: 'Logo saved successfully',
            logo: logoData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to save logo',
            message: error.message
        });
    }
});

// 3. Get All Logos (Admin)
app.get('/api/logos', (req, res) => {
    const { type, search, limit = 50, skip = 0 } = req.query;

    let filtered = logoDatabase.logos;

    if (type) {
        filtered = filtered.filter(logo => logo.type === type);
    }

    if (search) {
        filtered = filtered.filter(logo =>
            logo.prompt?.toLowerCase().includes(search.toLowerCase()) ||
            logo.text?.toLowerCase().includes(search.toLowerCase())
        );
    }

    const paginated = filtered.reverse().slice(skip, skip + limit);

    res.json({
        success: true,
        total: filtered.length,
        logos: paginated
    });
});

// 4. Get Logo by ID
app.get('/api/logos/:id', (req, res) => {
    const logo = logoDatabase.logos.find(l => l.id === req.params.id);

    if (!logo) {
        return res.status(404).json({
            success: false,
            error: 'Logo not found'
        });
    }

    res.json({
        success: true,
        logo: logo
    });
});

// 5. Delete Logo (Admin)
app.delete('/api/logos/:id', (req, res) => {
    const index = logoDatabase.logos.findIndex(l => l.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Logo not found'
        });
    }

    const logo = logoDatabase.logos[index];
    
    // Delete file
    const filePath = path.join(__dirname, `..${logo.filePath}`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Remove from database
    logoDatabase.logos.splice(index, 1);

    // Update analytics
    if (logo.type === 'ai') {
        logoDatabase.analytics.aiLogos--;
    } else {
        logoDatabase.analytics.manualLogos--;
    }
    logoDatabase.analytics.totalLogos--;

    res.json({
        success: true,
        message: 'Logo deleted successfully'
    });
});

// 6. Get Analytics
app.get('/api/analytics', (req, res) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayLogos = logoDatabase.logos.filter(logo => 
        new Date(logo.createdAt) >= today
    );

    res.json({
        success: true,
        analytics: {
            ...logoDatabase.analytics,
            todayCreated: todayLogos.length,
            lastUpdated: new Date()
        }
    });
});

// 7. Get Dashboard Stats
app.get('/api/dashboard-stats', (req, res) => {
    const stats = {
        totalLogos: logoDatabase.logos.length,
        aiLogos: logoDatabase.logos.filter(l => l.type === 'ai').length,
        manualLogos: logoDatabase.logos.filter(l => l.type === 'manual').length,
        activeUsers: 1, // In production, track real sessions
        recentActivity: logoDatabase.logos.slice(-10).reverse()
    };

    res.json({
        success: true,
        stats: stats
    });
});

// 8. Track User Activity
app.post('/api/track-activity', (req, res) => {
    const { userId, action, type, data } = req.body;

    const activity = {
        userId: userId || 'anonymous',
        action: action,
        type: type,
        data: data,
        timestamp: Date.now(),
        userAgent: req.headers['user-agent']
    };

    // Store activity (in production, use database)
    logoDatabase.users.push(activity);

    res.json({
        success: true,
        message: 'Activity tracked'
    });
});

// 9. Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'API is running',
        timestamp: new Date()
    });
});

// Serve uploaded logos
app.use('/logos', express.static(path.join(__dirname, '../logos')));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════╗
    ║   🎨 LOGOforge Backend Server      ║
    ║                                    ║
    ║   Server running on port ${PORT}    ║
    ║   API: http://localhost:${PORT}/api   ║
    ╚════════════════════════════════════╝
    `);
});