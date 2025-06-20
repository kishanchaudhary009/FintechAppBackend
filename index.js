const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { User } = require("./models");
const { Stock } = require("./models");
const { Expense } = require("./models");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data and urlencoded forms

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.get('/', (req, res) => {
    res.send("Hello from Express backend!");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post("/savenewuser", async (req, res) => {
    try {
        const id = req.body.id;

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        const existingUser = await User.findOne({ id });

        if (existingUser) {
            return res.status(200).json({ message: "User already exists", user: existingUser });
        }

        const newUser = new User({
            id: id,
            portfolio: [],
            expenses: []
        });

        await newUser.save();


        res.status(201).json({ message: "New user created", user: newUser });

    } catch (e) {
        console.error("Error saving user:", e);
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.get("/getuserbyid", async (req, res) => {
    try {
        const id = req.query.id
        const user = await User.findOne({ "id": id });
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(200).json({ "message": "No user exist" });
        }
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.post("/addstocktoportfolio", async (req, res) => {
    try {
        const { tickerId, companyName, companyLogoURL, stockQuantity, stockBuyPrice, id } = req.body;

        const stock = {
            tickerId,
            companyName,
            companyLogoURL,
            stockQuantity,
            stockBuyPrice
        };

        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.portfolio.push(stock);
        await user.save();

        res.status(200).json({ message: "Stock added to portfolio", portfolio: user.portfolio });
    } catch (e) {
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.post("/addexpense", async (req, res) => {
    try {
        const { expenseCategory, expenseAmount, expenseDate, id } = req.body;
        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const expense = {
            expenseCategory,
            expenseAmount,
            expenseDate
        };

        user.expenses.push(expense);
        await user.save();

        res.status(200).json({ message: "Expense added successfully" });
    } catch (e) {
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});
