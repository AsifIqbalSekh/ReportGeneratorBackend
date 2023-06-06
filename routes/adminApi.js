const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Audiologist = require("../models/audiologistModel");
const commissionModel = require("../models/commissionModel");
const router = express.Router();
const saltRounds = 9;

router.get("/admins", (req, res) => {
  Admin.find((err, doc) => {
    res.send(doc);
  });
});

router.post("/register", async (req, res) => {
  let adminData = req.body;
  await Admin.findOne({ username: adminData.username }, (err, doc) => {
    if (!doc) {
      if (req.body.master == "5f89a10c7b9c368e9012bf27") {
        bcrypt.hash(adminData.password, saltRounds, (err, hash) => {
          if (err) {
            console.log(err);
          }
          adminData.password = hash;
          let admin = new Admin(adminData);
          admin.save((error, registeredAdmin) => {
            if (error) {
              console.log(error);
            } else {
              res.status(200).send(registeredAdmin);
            }
          });
        });
      } else {
        res.status(401).send("Not authorized");
      }
    } else {
      res.send("Admin already exists");
    }
  });
});

router.post("/login", (req, res) => {
  let adminData = req.body;

  Admin.findOne({ username: adminData.username }, (error, admin) => {
    if (error) {
      console.log(error);
    } else {
      if (!admin) {
        res.status(401).send("Invalid Admin Username");
      } else {
        bcrypt.compare(adminData.password, admin.password, (err, result) => {
          if (err) {
            res.status(401).send("Invalid password");
          }
          if (result) {
            let payload = { subject: admin._id };
            let token = jwt.sign(payload, "secretKeys");
            res.status(200).send({ token: token });
          }
        });
      }
    }
  });
});

//register a new audiologist
router.post("/audiologistregister", authorizer, (req, res) => {
  let doctorData = req.body;
  Audiologist.find({ username: doctorData.username }, (err, doc) => {
    if(err){
      console.log(err);
    } else
    if (!doc.length) {
      // replace password with hash
      bcrypt.hash(doctorData.password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
        }
        doctorData.passwordHash = hash;
        let doctor = new Audiologist(doctorData);
        doctor.save((error, registeredDoctor) => {
          if (error) {
            console.log(error);
          } else {
            res.status(200).send(registeredDoctor);
          }
        });
      });
    } else {
      console.log(doc);
      res.send("username already in use")
    }
  });
});

router.get("/searchaudiologist/:name", authorizer, (req, res) => {
  let regex = "^" + req.params.name;

  Audiologist.find({ name: new RegExp(regex, "i") }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

router.get("/audiologist/:id", authorizer, (req, res) => {
  console.log(req.params.id);
  Audiologist.findById(req.params.id, (err, docs) => {
    if (err) {
      console.log(err);
      res.send("No entry");
    } else {
      res.json(docs);
    }
  });
});

router.patch("/audiologistupdate/:id", authorizer, (req, res) => {
  let doctorData = req.body;

  // replace password with hash
  bcrypt.hash(doctorData.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    doctorData.passwordHash = hash;
    Audiologist.findByIdAndUpdate(req.params.id, doctorData, (err, doc) => {
      if (err) {
        console.log(err);
        res.send("error", err);
      } else {
        res.send(doc);
      }
    });
  });
});

router.get("/delete/:id", authorizer, (req, res) => {
  Audiologist.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      console.log(err);
      res.send("error", err);
    } else {
      res.send(doc);
    }
  });
});

router.get("/allaudiologists", authorizer, (req, res) => {
  Audiologist.find((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

router.get("/allrefs", authorizer, (req, res) => {
  commissionModel.find((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});
router.get("/refs/:name", authorizer, (req, res) => {
  let regex = "^" + req.params.name;

  commissionModel.find({ name: new RegExp(regex, "i") }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});


function authorizer(req, res, next) {
  const bearerToken = req.headers["authorization"];

  if (bearerToken !== undefined) {
    jwt.verify(bearerToken, "secretKeys", (err, result) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else res.sendStatus(403);
}
module.exports = router;
