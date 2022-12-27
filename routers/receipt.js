const express = require("express");
const router = express.Router();

const ReceiptController = require("../controllers/ReceiptController");
const { AuthMiddleware } = require("../helper/JWT");
//--------
//these router handle sign in and sign up
router.get("/list", AuthMiddleware, ReceiptController.getList);
router.get("/getUserReceipt", AuthMiddleware, ReceiptController.getUserReceipt);
router.get("/:id", ReceiptController.getOne);
router.post("/new", ReceiptController.create);
router.put("/:id", ReceiptController.update);
router.delete("/:id", ReceiptController._delete);

//

//--------
//these router handle authentication and authorization

//
module.exports = router;
