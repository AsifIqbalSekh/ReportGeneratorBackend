const mongoose = require("mongoose");
var audiologistSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("audiologist", audiologistSchema);
// const Patient = module.exports = mongoose.model('patient', patientschema);
