require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.error("Error in connecting to the Database:", error));
db.once('open', () => console.log("Connected to Database"));

// Define Mongoose Schema and Model
const transactionSchema = new mongoose.Schema({
    Category: {
        type: String,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    Info: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.post("/add", async (req, res) => {
    try {
        const { category, amount, info, date } = req.body;
        console.log("Received data:", { category, amount, info, date });
        
        if (!category || !amount || !info || !date) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }

        const transaction = new Transaction({
            Category: category,
            Amount: amount,
            Info: info,
            Date: date
        });

        await transaction.save();
        console.log("Record Inserted Successfully:", transaction);
        res.status(200).json({ status: 'success', message: 'Record Inserted Successfully' });
    } catch (err) {
        console.error("Error inserting record:", err);
        res.status(500).json({ status: 'error', message: 'Error inserting record' });
    }
});

// Route to serve index.html (assuming it's in the 'public' folder)
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start Server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
