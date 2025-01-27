const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // Ensure this matches the folder name
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// In-memory "database"
const images = [];

// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    const { caption } = req.body;
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    images.push({ imageUrl, caption });
    res.status(200).send('Image uploaded!');
});

// Fetch images endpoint
app.get('/images', (req, res) => res.json(images));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
