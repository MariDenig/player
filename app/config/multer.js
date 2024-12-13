const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav') {
        cb(null, true);
    } else {
        cb(new Error('Formato de arquivo não suportado. Use MP3 ou WAV.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // limite de 10MB
    }
});

module.exports = upload; 