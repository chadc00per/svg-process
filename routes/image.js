const path = require('path');
const express = require('express');
const router = express.Router();

const { logMessage } = require('../config');
const imageToSvg = require('../processing/svg');

// curl -X POST http://localhost:3000/image/svg -H "Content-Type: application/json" -d '{"image": "https://cdn-sprites.flaticon.com/families/4_subhome_card.jpg","color":"#FFFFFF"}'
router.post('/svg', express.json(), async (req, res) => {
    const { image, color } = req.body;

    if (!image) {
        logMessage('Image is required');
        return res.status(400).json({ error: 'Image is required' });
    }

    if (color) {
        const hexColorRegex = /^#?[0-9A-Fa-f]{6}$/;
        if (!hexColorRegex.test(color)) {
            logMessage('Invalid color format. Must be a 6 digit hex code');
            return res.status(400).json({ error: 'Invalid color format. Must be a 6 digit hex code' });
        }
    }

    try {
        logMessage('Starting image to SVG conversion');
        const svg = await imageToSvg(image, color);
        logMessage('Image to SVG conversion successful');
        res.status(200).send(svg);
    } catch (err) {
        logMessage(`Error converting image to SVG: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;