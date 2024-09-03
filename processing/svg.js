const fs = require('fs');
const Jimp = require('jimp');
const potrace = require('potrace');
const path = require('path');
const axios = require('axios');

const imageToSvg = async (imagePathOrUrl, color = '#000000') => {
    if (!imagePathOrUrl) {
        throw new Error('Image file path or URL is required');
    }

    const validExtensions = ['.png', '.jpg', '.webp', '.bmp', '.jpeg', '.tif'];
    const fileExtension = path.extname(imagePathOrUrl).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        throw new Error('Invalid file type. Supported file types are: PNG, JPG, WEBP, BMP, JPEG, TIF.');
    }

    if (!/^#/.test(color)) {
        color = `#${color}`;
    }

    const loadImage = imagePathOrUrl.startsWith('http') 
        ? axios.get(imagePathOrUrl, { responseType: 'arraybuffer' }).then(response => {
            if (response.status !== 200) {
                throw new Error('URL does not exist or is not accessible');
            }
            return Jimp.read(response.data);
        }).catch(err => {
            throw new Error('Error fetching image from URL');
        })
        : Jimp.read(imagePathOrUrl);

    try {
        const image = await loadImage;

        image.autocrop();

        const maxDimension = Math.max(image.bitmap.width, image.bitmap.height);
        const xOffset = (maxDimension - image.bitmap.width) / 2;
        const yOffset = (maxDimension - image.bitmap.height) / 2;

        const squareImage = new Jimp(maxDimension, maxDimension);
        squareImage.composite(image, xOffset, yOffset);

        squareImage.resize(1024, 1024, Jimp.RESIZE_BILINEAR);

        return new Promise((resolve, reject) => {
            squareImage.getBuffer(Jimp.MIME_PNG, (err, imageBuffer) => {
                if (err) return reject(err);

                potrace.trace(imageBuffer, { color: color }, (err, svg) => {
                    if (err) return reject(err);
                    resolve(svg);
                });
            });
        });

    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = imageToSvg;