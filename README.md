# SVG Process
This is a simple API that converts an image url to SVG in a specific color.
**Supports:**
- PNG
- JPG
- WEBP
- BMP
- JPEG
- TIF

## Start the server: `npm start`

## Endpoints
#### Convert an Image to SVG
```sh
curl -X POST http://localhost:3000/image/svg -H "Content-Type: application/json" -d '{"image": "https://cdn-sprites.flaticon.com/families/4_subhome_card.jpg","color":"#FFFFFF"}'
```

**Request Body Parameters:**
 - `image`: The URL of the image to convert to SVG
 - `color`: The color to use for the SVG (optional, default is white)

## License
This repository uses potrace as a dependency, which is licensed under the GNU License.