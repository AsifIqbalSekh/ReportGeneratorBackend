const mongoose = require("mongoose");
var countingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("count", countingSchema);
// const Patient = module.exports = mongoose.model('patient', patientschema);
