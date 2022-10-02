const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const validateUserData = require("../helpers/validate-user-data");

module.exports = {
  register: async (req, res) => {
    const { name, username, email, tel, password, confirmpassword } = req.body;

    if (!name) {
      return res.status(422).json({ message: "Please insert name." });
    }

    if (!username) {
      return res.status(422).json({ message: "Please insert username." });
    }

    const usernameExists = await User.findOne({ username: username });

    if (usernameExists) {
      return res.status(422).json({ message: "Please use another username." });
    }

    if (!email) {
      return res.status(422).json({ message: "Please insert email." });
    }

    if (!password) {
      return res.status(422).json({ message: "Please insert password." });
    }

    if (!confirmpassword) {
      return res
        .status(422)
        .json({ message: "Please insert password confirmation." });
    }

    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      return res.status(422).json({ message: "Please use another e-mail." });
    }

    const data = {
      name: name,
      username: username,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
    };

    let validationResult = await validateUserData(data);

    if (validationResult != "OK") {
      res.status(400).json({
        message: validationResult,
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      email,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      return res.status(200).json({
        message: "Your account was successfully created!",
      });
      // await createUserToken(newUser, req, res);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "An error ocurred while processing your request!",
      });
    }
  },

  login: async (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername) {
      return res
        .status(422)
        .json({ message: "Please insert email or username." });
    }

    if (!password) {
      return res.status(422).json({ message: "Please insert password." });
    }

    let user = null;

    if (emailOrUsername.includes("@")) {
      user = await User.findOne({ email: emailOrUsername });
    } else {
      user = await User.findOne({ username: emailOrUsername });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.locked == true) {
      return res.status(400).json({ message: "This account is locked." });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Invalid password." });
    }

    user.password = undefined;

    try {
      const secret = process.env.SECRET;

      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );

      res
        .status(200)
        .json({ message: "Successfully authenticated.", token, user });
      return;
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "An error ocurred while processing your request!",
      });
      return;
    }
  },

  checkUser: async (req, res) => {
    let currentUser;

    try {
      if (req.headers.authorization) {
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        currentUser = await User.findById(decoded.id);

        currentUser.password = undefined;
      } else {
        currentUser = null;
      }

      return res.status(200).send(currentUser);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "An error ocurred while processing your request!" });
    }
  },
};
