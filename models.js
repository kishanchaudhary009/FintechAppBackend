const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
    tickerId: String,
    companyName: String,
    companyLogoURL: String,
    stockQuantity: Number,
    stockBuyPrice: Number
});

const ExpenseSchema = new mongoose.Schema({
    expenseCategory: String,
    expenseAmount: Number,
    expenseDate: Date
});

const UserSchema = new mongoose.Schema({
    id: String,
    portfolio: [StockSchema],
    expenses: [ExpenseSchema]
});

const User = mongoose.model("User", UserSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);
const Stock = mongoose.model("Portfolio", StockSchema);

module.exports = { User, Expense, Stock };