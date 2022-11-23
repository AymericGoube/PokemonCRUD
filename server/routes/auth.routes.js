// const router = require("./index.routes");
const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    //If username already in use return bad request
    if (foundUser) {
      return res.status("400").send({
        message:
          "username already in use, try singning up with a different username",
      });
    }
    // encrypt password for security reason
    const hashedPassword = bcrypt.hashSync(password);
    const newUser = {
      username,
      password: hashedPassword,
      email,
    };

    console.log({ newUser });

    const createdUser = await User.create(newUser);

    res.status(201).json({ message: `User ${username} created` });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      res
        .status(400)
        .json({ message: "could not find an account with this username" });
    }
    const matchingPassword = bcrypt.compareSync(password, foundUser.password);
    if (!matchingPassword) {
      res.status(400).json({ messsage: "Wrong password" });
    }
    const payload = { username };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "10d",
    });
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
