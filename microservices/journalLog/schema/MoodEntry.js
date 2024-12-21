// models/MoodEntry.js
const mongoose = require('mongoose');

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  mood: { type: String, required: true },
  thoughts: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('MoodEntry', journalEntrySchema);
