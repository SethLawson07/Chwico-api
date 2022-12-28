const express = require("express");
const {
    addUser,
    getUsers,
    getUser,
    getUser1,
    updateUser,
    deleteUser,
} = require("../controllers/user");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config();


const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

router.route("/users").post(addUser);
router.route("/users").get(getUsers);
router.route("/users/:id").get(getUser);
router.route("/users/:email/:password").get(getUser1);
router.route("/users/:id").put(updateUser);
router.route("/users/:id").delete(deleteUser);

module.exports = router;