const { AuthMiddleware } = require("../helper/JWT");
const express = require("express");
const router = express.Router();
const DashBoardController = require("../controllers/DashBoardController");

router.get("/", AuthMiddleware, DashBoardController.getGeneralReport);
router.get("/timely", AuthMiddleware, DashBoardController.getTimelyReport);

module.exports = router;
