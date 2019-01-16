const mongoose = require('mongoose');

const gameSaveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: { type: String, required: true },
});

module.exports = mongoose.model('GameSave', gameSaveSchema);