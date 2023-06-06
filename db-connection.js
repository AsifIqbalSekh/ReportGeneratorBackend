const mongoose = require("mongoose");

// require("./models/patientModel");
mongoose.connect(
  "mongodb://127.0.0.1:27017/projectdb?retryWrites=true&w=majority",
  { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("successfully created connection with database");
    } else {
      console.log("error in connection:" + err);
    }
  }
);
