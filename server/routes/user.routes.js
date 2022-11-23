const router = require("express").Router();
const User = require("../models/User.model");

router.get("/", async (req, res, next) => {
  try {
    const allUser = await User.find();
    res.status("200").json(allUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
