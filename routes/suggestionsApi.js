const express = require("express");
const suggestionsModel = require("../models/suggestionsModel");
const router = express.Router();

router.get("/:fieldName", (req, res) => {
  suggestionsModel.findOne({ fieldName: req.params.fieldName }, (err, doc) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.send(doc.suggestions);
    }
  });
});

router.patch("/:fieldName", (req, res) => {
  //update or create a suggestion field
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  suggestionsModel.findOneAndUpdate(
    { fieldName: req.params.fieldName },
    req.body,
    options,
    (err, doc) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(201).send(doc);
      }
    }
  );
});

module.exports = router;
