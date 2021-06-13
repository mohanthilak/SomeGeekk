const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Question = require("../models/questions");

async function optionclicked(req) {
  const { id } = req.params;
  const que = await Question.findById(id);
  const type = req.body.type;
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (user.answer.length == 0) {
    const ans = {
      question: que.question,
      newOp: type,
    };
    await inde("increment", req, type);
    user.answer.push(ans);
    await user.save();
  } else {
    let test = true;
    for (let i = 0; i < user.answer.length; i++) {
      if (que.question === user.answer[i].question) {
        test = false;
        let opType = user.answer[i].newOp;
        await inde("decrement", req, opType);
        await inde("increment", req, type);
        user.answer[i].newOp = type;
        await user.save();
      }
    }
    if (test) {
      const ans = {
        question: que.question,
        newOp: type,
      };
      await inde("increment", req, type);
      user.answer.push(ans);
      await user.save();
    }
  }
}

async function inde(x, req, type) {
  const question = await Question.findById(req.params.id);
  switch (type) {
    case "a":
      if (x === "increment") {
        question.opa++;
      }
      if (x === "decrement") {
        question.opa--;
      }
      break;
    case "b":
      if (x === "increment") {
        question.opb++;
      }
      if (x === "decrement") {
        question.opb--;
      }
      break;
    case "c":
      if (x === "increment") {
        question.opc++;
      }
      if (x === "decrement") {
        question.opc--;
      }
      break;
    case "d":
      if (x === "increment") {
        question.opd++;
      }
      if (x === "decrement") {
        question.opd--;
      }
      break;
  }
  await question.save();
}

router.post("/optionclicked/:id", async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id).populate("portal");
  console.log(question);
  optionclicked(req);
  // res.redirect("/portals/");
});

module.exports = router;
