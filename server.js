const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
require("./db-connection"); //For cloud-db connection

const app = express();
app.use(bodyParser.json()); //receive json
app.use(cors()) //for dev, SHOULD BE ELIMINATED IN PRODUCTION
var port = 5000;

// const patient_controller = require("./routes/patientApi");  //For patient's details
// app.use("/api" , patient_controller);

const admin_controller = require("./routes/adminApi"); //For admin
app.use("/admin", admin_controller);

const audiologist_controller = require("./routes/audiologistApi"); //For audiologist
app.use("/audiologist", audiologist_controller);

const suggestions_controller = require("./routes/suggestionsApi"); //Suggestions
app.use("/suggestions", suggestions_controller);

app.listen(port, () => {
  console.log("server running on port" + " " + port);
});
