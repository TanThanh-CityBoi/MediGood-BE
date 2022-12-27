
const express = require('express');
const router = express.Router();

const BannerController = require('../controllers/BannerController');
const {AuthMiddleware} = require('../helper/JWT');
//--------
//these router handle sign in and sign up
router.get("/list", BannerController.getList);
router.get("/:id", BannerController.getOne);
router.post("/new", BannerController.create);
router.put("/:id", BannerController.update);
router.delete("/:id", BannerController._delete);


//

//--------
//these router handle authentication and authorization

//
module.exports = router;