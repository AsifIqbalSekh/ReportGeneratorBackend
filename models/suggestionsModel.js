const mongoose = require("mongoose");
var suggestionsSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
  },
  suggestions: {
    type: [String],
    required: false,
  },
});
module.exports = mongoose.model("suggestions", suggestionsSchema);
