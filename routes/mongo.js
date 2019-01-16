const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const GameSave = require("../models/gameSave");

router.post("/", function (req, res) {
    const data = new GameSave({
        _id: new mongoose.Types.ObjectId(),
        number: req.body.name
    });
    data
        .save()
        .then( function (result) {
            console.log(result);
            res.status(201).send("Saved data for user: " + result.number + " successfully");
        })
        .catch( function(err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;