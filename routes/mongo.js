const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const GameSave = require("../models/gameSave");

/**
 * Create gameSave in Database
 */
 router.post("/", (req, res) => {
    console.log(req.body.number);
    const data = new GameSave({
        _id: new mongoose.Types.ObjectId(),
        number: req.body.number
    });
    data
    .save()
    .then(result => {
        console.log(result);
        res.status(201).send("Saved data for user: " + result.number + " successfully");
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

/**
 * Retrieve a gameSave
 */
router.get("/:phoneNumber", (req, res) => {
    var num = req.params.phoneNumber;
    if (num.length === 12) { //A phone number was sent
        GameSave.findOne({number : num})
        .select('_id number')
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).send(doc);
            } else {
                res
                .status(404)
                .json({ message: "No valid entry found for provided phone number" });
            }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
      });
} else { //An ID was sent
    GameSave.findById(num)
        .select('_id') //Only retrieve the ID for now
        .then(doc => {
          console.log("From database for debug (hopefully)", doc);
          if (doc) {
            res.status(200).send(doc);
        } else {
            res
            .status(404)
            .json({ message: "No entry with that ID" });
        }
    })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
      });
    }
});

 module.exports = router;