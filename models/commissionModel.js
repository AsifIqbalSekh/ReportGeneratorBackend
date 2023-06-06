const mongoose = require("mongoose");
var commissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: [Number],
    required: false,
    default: [0,0,0,0,0,0,0,0,0,0,0,0],
  }
});
module.exports = mongoose.model("commission", commissionSchema);
