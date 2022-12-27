
const express = require('express');
const router = express.Router();

const NewsController = require('../controllers/NewsController');
const {AuthMiddleware} = require('../helper/JWT');
//--------
//these router handle sign in and sign up
router.get("/list", NewsController.getList);
router.get("/:id", NewsController.getOne);
router.post("/new", NewsController.create);
router.put("/:id", NewsController.update);
router.delete("/:id", NewsController._delete);


//

//--------
//these router handle authentication and authorization

//
module.exports = router;