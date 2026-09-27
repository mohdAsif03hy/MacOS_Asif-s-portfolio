import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('public/images');

async function processImages() {
    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
            const base = path.basename(file, ext);
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(imagesDir, `${base}.webp`);

            try {
                const img = sharp(inputPath);
                const metadata = await img.metadata();

                let resizeOptions = {};
                if (file.includes('wallpaper')) {
                    resizeOptions = { width: 1920, withoutEnlargement: true };
                } else if (file.startsWith('project-') || file.startsWith('gal') || file.startsWith('blog')) {
                    resizeOptions = { width: 800, withoutEnlargement: true };
                } else if (file.startsWith('avatar-') || file.startsWith('adrian')) {
                    resizeOptions = { width: 400, withoutEnlargement: true };
                } else if (metadata.width > 800) {
                    resizeOptions = { width: 800, withoutEnlargement: true };
                }

                await sharp(inputPath)
                    .resize(resizeOptions)
                    .webp({ quality: 82, effort: 6 })
                    .toFile(outputPath);

                const beforeSize = (fs.statSync(inputPath).size / 1024).toFixed(1);
                const afterSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
                console.log(`Converted ${file} (${beforeSize} KB) -> ${base}.webp (${afterSize} KB)`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err.message);
            }
        }
    }
}

processImages();
