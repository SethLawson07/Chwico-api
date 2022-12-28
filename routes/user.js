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


router.route("/users").post(addUser);
router.route("/users").get(getUsers);
router.route("/users/:id").get(getUser);
router.route("/users/:email/:password").get(getUser1);
router.route("/users/:id").put(updateUser);
router.route("/users/:id").delete(deleteUser);

module.exports = router;