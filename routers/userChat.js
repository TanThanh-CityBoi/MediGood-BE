const express = require("express")
const router = express.Router()
const userChatController = require("../controllers/UserChatController")

router.post("/send-msg-to-admin", userChatController.sendMsgToAdmin)
router.post("/send-msg-to-user", userChatController.sendMsgToUser)
router.get("/get-chat", userChatController.getChat)
router.get("/get-all-contacts-and-chats", userChatController.getAllUser)
router.post("/add-chat-user", userChatController.addChatUser)

module.exports = router
