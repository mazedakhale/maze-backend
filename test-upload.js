const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Simple file upload test
app.post('/test-upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${uuid()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, req.file.buffer);
    const fileUrl = `/uploads/${fileName}`;

    res.json({ 
      success: true, 
      fileUrl,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});
