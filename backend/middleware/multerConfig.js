const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = path.extname(file.originalname);
    callback(null, name + Date.now() + extension);
  }
});

module.exports = async (req, res, next) => {
  if (!req.file) return next();
  const inputPath = req.file.path;
  const outputFilename = req.file.filename.split('.')[0] + '.avif';
  const outputPath = path.join(path.dirname(inputPath), outputFilename);
  try {
    await sharp(inputPath)
      .avif({ quality: 50 })
      .toFile(outputPath);

    fs.unlinkSync(inputPath);
    req.file.filename = outputFilename;
    req.file.path = outputPath;
    next();
  } catch (err) {
    console.error('Erreur lors de la conversion en AVIF :', err);
    res.status(500).json({ error: 'Erreur lors de la conversion de l’image' });
  }
};

module.exports = multer({ storage }).single('image');
