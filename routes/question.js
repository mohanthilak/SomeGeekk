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
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });

async function imageConvert(txt) {
  let imgConverted;
  await (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(txt);
    imgConverted = text.replace(/(\r\n|\n|\r)/gm, "");
  })();
  return imgConverted;
}

// anotherCheck(id, req, text);
async function check(id, req, text) {
  const questions = await Portal.findById(id).populate("question");
  const questionsArr = questions.question;
  let test = true;
  for (let i = 0; i < questionsArr.length; i++) {
    if (text === questionsArr[i].question) {
      test = false;
      break;
    }
  }
  return test;
}

async function uploadQuestion(id, req, text) {
  const portal = await Portal.findById(id);
  const user = await User.findById(req.user._id);
  const questions = new Question({
    question: text,
    type: req.body.type,
    questionLoc: { url: req.file.path, filename: req.file.filename },
  });
  questions.user = req.user._id;
  questions.portal = id;
  user.questions.push(questions);
  portal.question.push(questions);
  await questions.save();
  await portal.save();
  await user.save();
  req.flash("success", "created a new Question!");
}

router.get("/newquestion", isLoggedin, (req, res) => {
  const { id } = req.params;
  res.render("questions/new", { id });
});

router.post(
  "/newquestion",
  isLoggedin,
  upload.single("product"),
  async (req, res) => {
    const { id } = req.params;
    let text = await imageConvert(req.file.path);
    console.log(text);
    let checkResult = await check(id, req, text);
    if (checkResult) {
      await uploadQuestion(id, req, text);
      return res.redirect(`/portals/${id}`);
    } else if (!checkResult) {
      await cloudinary.uploader.destroy(req.file.filename);
      req.flash("success", "Question exist!");
      return res.redirect(`/portals/${id}`);
    }
  }
);

module.exports = router;
