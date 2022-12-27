const { AuthMiddleware } = require("../helper/JWT")
const express = require("express")
const router = express.Router()
const AuthController = require("../controllers/AuthController")

router.post("/login", AuthController.login)
router.post("/register", AuthController.register)
router.get("/refresh", AuthMiddleware, AuthController.refresh)
router.get("/:id/verify/:token/", AuthController.verifyEmail)

module.exports = router
