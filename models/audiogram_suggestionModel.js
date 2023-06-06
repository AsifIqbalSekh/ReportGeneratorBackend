const mongoose = require("mongoose");
var suggestionSchema = new mongoose.Schema({
  leftnote: {
    type: String,
    required: false,
  },
  rightnote: {
    type: String,
    required: false,
  },
  rinne: {
    type: String,
    required: false,
  },
  weber: {
    type: String,
    required: false,
  },
  recommendation: {
    type: String,
    required: false,
  }
});
module.exports = mongoose.model("suggestion", suggestionSchema);
// const Patient = module.exports = mongoose.model('patient', patientschema);
