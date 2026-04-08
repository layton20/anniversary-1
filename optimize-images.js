const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './assets';
const outputDir = './assets-optimized';

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else {
            const relative = path.relative(inputDir, fullPath);
            const outputPath = path.join(outputDir, relative);

            fs.mkdirSync(path.dirname(outputPath), { recursive: true });

            sharp(fullPath)
                .resize({
                    width: 1200,
                    withoutEnlargement: true
                })
                .webp({ quality: 70 })
                .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'))
                .then(() => console.log('✅', relative))
                .catch(err => console.error('❌', err));
        }
    });
}

processDir(inputDir);