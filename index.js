const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname))

const filePath = path.join(__dirname, 'data.json');

// Helper function to read and write JSON file
const readDataFromFile = () => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const writeDataToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Endpoint to fetch bank details
app.get('/data', (req, res) => {
    const data = readDataFromFile();
    res.json(data);
});

// Endpoint to add new bank file details
app.post('/submit', (req, res) => {
    const { bankFile, drawerNumber } = req.body;
    if (!bankFile || !drawerNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const data = readDataFromFile();
    data.push({ bankFile, drawerNumber });
    writeDataToFile(data);

    res.status(201).json({ message: 'Data added successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
