const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { AuthMiddleware } = require("../helper/JWT");
//--------
//these router handle sign in and sign up
router.get("/list", UserController.getList);
router.get("/getCurrentUser", AuthMiddleware, UserController.getCurrentUser);
router.get("/:id", UserController.getOne);
router.post("/new", UserController.create);
router.post("/addItemToCart", AuthMiddleware, UserController.userAddToCart);
router.post("/editCart", AuthMiddleware, UserController.userEditCart);

router.put("/:id", UserController.update);
router.delete("/:id", UserController._delete);

//

//--------
//these router handle authentication and authorization

//
module.exports = router;
