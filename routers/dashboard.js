const { AuthMiddleware } = require("../helper/JWT");
const express = require("express");
const router = express.Router();
const DashBoardController = require("../controllers/DashboardController");

router.get("/general", AuthMiddleware, DashBoardController.getGeneralReport);
router.get("/timely", AuthMiddleware, DashBoardController.getTimelyReport);

module.exports = router;
