const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const menuController = require("../controllers/menuController");

// router.post("/login", authControllers.checkToken, authControllers.login);
router.post("/login", authControllers.login);
// router.get("/token", authControllers.checkToken, menuController.getAll);
router.post("/register", authControllers.register);
router.post("/loginKH", authControllers.loginKH);
module.exports = router;
