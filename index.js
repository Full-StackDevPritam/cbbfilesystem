const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

// Use middleware
app.use(cors()); // To handle cross-origin requests
app.use(bodyParser.json()); // To parse JSON bodies

app.use(express.static(__dirname))

// Helper function to read data from the JSON file
const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data from file:', error);
        return [];
    }
};

// Helper function to write data to the JSON file
const writeDataToFile = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing data to file:', error);
    }
};

// Route to fetch bank file data (GET /data)
app.get('/data', (req, res) => {
    const bankData = readDataFromFile();
    res.json(bankData); // Send the current data from the JSON file
});

// Route to handle form submission (POST /submit)
app.post('/submit', (req, res) => {
    const { bankFile, drawerNumber } = req.body;

    if (!bankFile || !drawerNumber) {
        return res.status(400).json({ error: 'Bank File and Drawer Number are required' });
    }

    // Read the current data from the file
    const bankData = readDataFromFile();

    // Add the new entry
    const newEntry = { bankFile, drawerNumber };
    bankData.push(newEntry);

    // Write the updated data back to the file
    writeDataToFile(bankData);

    res.json({ message: 'Data added successfully', data: newEntry });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
