const express = require("express");
const router = express.Router();
const Portal = require("../models/portals");
const { isLoggedin } = require("../middleware");

router.get("/", async (req, res) => {
  const portals = await Portal.find({});
  res.render("portals/index", { portals });
});

router.get("/new", isLoggedin, (req, res) => {
  res.render("portals/new");
});

router.post("/", isLoggedin, async (req, res) => {
  const portal = new Portal(req.body.portal);
  await portal.save();
  req.flash("success", "New Portal Created!");
  res.redirect(`/portals/${portal._id}`);
});

router.get("/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const questions = await Portal.findById(id).populate("question");
  console.log(questions);
  if (!questions) {
    req.flash("error", "No Portal");
    return res.redirect("/portals");
  }
  res.render("portals/show", { id, questions });
  // res.send(`questions: ${questions.question}`);
});

module.exports = router;
