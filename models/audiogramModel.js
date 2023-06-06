const mongoose = require("mongoose");
var audiogramSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  //array elements are joined using '.'(comma)
  //arrays are joined using '*'(asterisk)
  //note portion starts with <note/>
  //Eg. "1,2,3*1,3,5"
  leftChart: String,
  leftNote: String,

  rightChart: String,
  rightNote: String,

  // the selected value are joined by ','(comma)
  rinne: String,
  rinneNote: String,
  weber: String,
  weberNote: String,
  testTechnique: String,
  validity: String,
  reliability: String,
  recommendation:String,
  audiologistId:String
}, {
  timestamps: true,
});
module.exports = mongoose.model("audiogram", audiogramSchema);
