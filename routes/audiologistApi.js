const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Audiologist = require("../models/audiologistModel");
const Patient = require("../models/patientModel");
const Count = require("../models/countModel");
const Audiogram = require("../models/audiogramModel");
const { Promise } = require("mongoose");
const audiogramModel = require("../models/audiogramModel");
const mongoose = require("mongoose");
const Audiogramtext = require("../models/audiogram_suggestionModel");
const Audiogramtextmodel = mongoose.model("suggestion");
const router = express.Router();
const saltRounds = 11;
const commissionModel = require("../models/commissionModel");
const moment = require("moment");
// audiologist login
router.post("/login", (req, res) => {
  let docData = req.body;

  Audiologist.findOne({ username: docData.username }, (error, doc) => {
    if (error) {
      console.log(error);
    } else {
      if (!doc) {
        res.status(401).send("Invalid Admin Username");
      } else {
        bcrypt.compare(docData.password, doc.passwordHash, (err, result) => {
          if (err) {
            res.status(401).send("Invalid password");
          }
          if (result) {
            let payload = { username: doc.username };
            let token = jwt.sign(payload, "churmur_churmur_dhumdharakka");
            res.status(200).send({ token: token, audiologistId: doc._id });
          }
        });
      }
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

var a = async function getDocs() {
  var n = await Patient.find().countDocuments();
  // console.log(n);
  return n;
};

async function deleteLastId() {
  try {
    await Count.findOneAndDelete({ id: "lastId" }, (err, doc) => {
      console.log("reset lastId");
    });
  } catch (e) {
    console.log(e);
  }
}

//generate and update new id
async function getId(username) {
  // await deleteLastId(); //experiment purpose
  //padded date month
  // let currentDate = new Date()
  //   .toLocaleDateString("en-US", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   })
  //   .replace(/\//g, "");
  let currentDate = moment(new Date()).format("DDMMYYYY");
  let currentId;
  let count = 0;

  //retrieve the last id
  let lastId = await Count.findOne({ id: "lastId" }, (err, doc) => { });
  if (lastId == null) {
    //if lastId doesn't exist create one
    currentId = username + currentDate + count.toString();
    new Count({
      id: "lastId",
      data: currentId,
    }).save();
  } else {
    //if lastId exits compare the date and change the data
    // console.log(1,lastId);
    //retrieve date and count from last id
    let lastDate = lastId.data.toString().slice(2, 10);
    let lastCount = lastId.data.toString().slice(10);

    //if date is same, increment the count by one
    // console.log(lastDate, currentDate);
    if (lastDate == currentDate) {
      count = (Number(lastCount) + 1).toString();
    }
    //update the lastId
    currentId = username + currentDate + count.toString();
    let _ = await Count.updateOne(
      { id: "lastId" },
      {
        id: "lastId",
        data: currentId,
      },
      (err, doc) => {
        // console.log("new id saved", doc.id);
      }
    );
    // console.log("new id:", currentId);
  }
  return currentId;
}

router.get("/deletelastid", (req, res) => {
  deleteLastId();
});

async function updateCommission(name) {
  console.log("i ran");
  let _ = await commissionModel.findOne({ name: name }, (err, doc) => {
    if (doc) {
      console.log(doc);
      currentMonth = new Date().getMonth();
      doc.count[currentMonth] += 1;
      console.log((currentMonth + 1) % 12);
      doc.count[(currentMonth + 1) % 12] = 0; //reset the future entries
      console.log(doc.count);

      commissionModel.findOneAndUpdate({ name: name }, doc, (err, res) => {
        console.log(res);
      });
      // new commissionModel({ name: name,thisMonth: doc.thisMonth+1 });
    } else if (!doc) {
      //create the doctor's entry
      new commissionModel({ name: name }).save((err, doc) => {
        console.log(doc);
        updateCommission(name);
      });
    }
  });
}
router.post("/patiententry", authorizer, async (req, res) => {
  // deleteLastId();
  let patientData = req.body;
  let username = jwt.verify(
    req.headers["authorization"],
    "churmur_churmur_dhumdharakka"
  ).username;
  let _ = await updateCommission(patientData.referred_by);
  patientData.id = await getId(username);
  // console.log(patientData);
  let patient = new Patient(patientData);
  patient.save((error, patientDoc) => {
    if (error) {
      // console.log(error);
      res.status(400).send({ message: error.message });
    } else {
      // (new Count({id: "lastId",data:}))
      res.status(200).send(patientDoc);
    }
  });
});

router.delete("/patient/:id", authorizer, (req, res) => {
  Patient.deleteOne({ _id: req.params.id }, (err, docs) => {
    if (!err) {
      res.send("student deleted");
    } else {
      res.json(docs);
    }
  });
});

router.get("/patient/:id", authorizer, async (req, res) => {
  console.log(req.params);
  let _ = await Patient.findOne({ id: req.params.id }, (err, docs) => {
    if (err) console.log(err);
    else {
      res.json(docs);
    }
  });
});
router.patch("/patient/:id", authorizer, (req, res) => {
  Patient.findOneAndUpdate({ id: req.params.id }, req.body, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.json(err);
    }
  });
});

/* router.put("/:id", authorizer, (req, res) => {
  Patient.findOneAndUpdate(
    { _id: req.params._id },
    {
      $set: {
        name: req.body.name,
        gender: req.body.phone,
        age: req.body.age,
        phone: req.body.phone,
        referred_by: req.body.referred_by,
        adress: req.body.adress,
        complaint: req.body.complaint,
      },
    },
    (err, docs) => {
      if (!err) {
        res.json(docs);
      } else {
        res.json(err);
      }
    }
  );
}); */

router.post("/audiogram-entry", authorizer, async (req, res) => {
  let data = req.body;
  let _ = await new Audiogram(data).save((err, doc) => {
    if (err) {
      console.log(err);
      res.status(400).send({ message: err.message });
    } else {
      console.log(doc);
      res.status(201).send(doc);
    }
  });
});

router.post("/audiogram-entry/edit", authorizer, (req, res) => {
  let data = req.body;

  try {
    Audiogram.findByIdAndUpdate(data._id, data, (err, doc) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(201).send(doc);
      }
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/audiogram/:id", authorizer, async (req, res) => {
  let id = req.params.id;
  data = await Audiogram.findById(id, (err, doc) => {
    if (err) {
      res.status(404).send({ message: "Couldn't find any entry" });
    } else {
      console.log(doc);
      res.send(doc);
    }
  });
});

router.get("/audiogram-list/:patientId", authorizer, async (req, res) => {
  await Audiogram.find({ patientId: req.params.patientId }, (err, doc) => {
    if (err) {
      res.status(404).send({ message: "Couldn't find any entry" });
    } else {
      res.send(
        doc.map((item) => {
          return { _id: item._id, updatedAt: item.updatedAt };
        })
      );
    }
  });
});

router.get("/a/patientsearch", authorizer, (req, res) => {
  // let data = req.body;
  let regex_Name = "^" + req.body.Name;
  let regex_Id = "^" + req.body.Id;
  let regex_Phone = req.body.Phone;

  // {"phone": new RegExp( regex_Phone, "i")}

  // let demo = "jdj";
  console.log(req.body);
  Patient.find(
    {
      $or: [
        { name: new RegExp(regex_Name, "i") },
        { id: new RegExp(regex_Id, "i") },
        { phone: regex_Phone },
      ],
    },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        res.json(docs);
      }
    }
  );
});

router.get("/listbyid/:id", authorizer, (req, res) => {
  let regex_Id = "^" + req.params.id;

  Patient.find({ id: new RegExp(regex_Id, "i") }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

router.get("/listbyname/:name", authorizer, (req, res) => {
  let regex = "^" + req.params.name;

  Patient.find({ name: new RegExp(regex, "i") }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

router.get("/listbyphone/:phone", authorizer, (req, res) => {
  let regex = req.params.phone;
  console.log(regex);

  Patient.find({ phone: new RegExp(regex, "i") }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

router.post("/textsuggestion", (req, res) => {
  var textmodel = new Audiogramtextmodel();
  textmodel.leftnote = req.body.leftnote;
  textmodel.rightnote = req.body.rightnote;
  textmodel.rinne = req.body.rinne;
  textmodel.weber = req.body.weber;
  textmodel.recommendation = req.body.recommendation;

  textmodel.save((err, docs) => {
    if (err) console.log(err);
    else res.json(docs);
  });
});

router.get("/a/g", authorizer, async (req, res) => {
  await Audiogramtext.find((err, docs) => {
    if (!err) res.json(docs);
    else console.log(err + "error");
  });
});

// router.post('/textsuggestion', (req, res)=>{
//   let audiogramtextData = req.body
//   let audiogramtext = new Audiogramtext(audiogramtextData)
//   audiogramtext.save((error, textdoc)=>{
//       if (error){console.log(error);}
//       else{res.status(200).send(textdoc);}
//   })
// })

function authorizer(req, res, next) {
  const bearerToken = req.headers["authorization"];

  if (bearerToken !== undefined) {
    // console.log(bearerToken);

    jwt.verify(bearerToken, "churmur_churmur_dhumdharakka", (err, result) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else res.sendStatus(403);
}

module.exports = router;
