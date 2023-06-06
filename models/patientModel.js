const mongoose = require("mongoose");
var patientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  referred_by: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  complain: {
    type: String,
    required: false,
  },

  created: { type: String, default: new Date().toLocaleDateString("en-US") },
});
module.exports = mongoose.model("patient", patientSchema);
// const Patient = module.exports = mongoose.model('patient', patientschema);
