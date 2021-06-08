const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const Portal = require("../models/portals");
const Question = require("../models/questions");
var multer = require("multer");
const path = require("path");
const { isLoggedin } = require("../middleware");
const { createWorker } = require("tesseract.js");
const worker = createWorker();

var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

async function imageConvert(txt) {
  let imgConverted;
  await (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(`./public/uploads/${txt}`);
    imgConverted = text.replace(/(\r\n|\n|\r)/gm, "");
  })();
  return imgConverted;
}

router.get("/newquestion", isLoggedin, (req, res) => {
  const { id } = req.params;
  res.render("questions/new", { id });
});

const multipleUpload = upload.fields([{ name: "product" }]);
router.post("/newquestion", multipleUpload, async (req, res) => {
  //need to check if the question is already uploaded or not
  //if not the upload the question
  //show take the username of the user
  let text = await imageConvert(req.files.product[0].filename);
  res.send(text);
});

module.exports = router;
