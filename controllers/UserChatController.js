const UserChat = require("../models/userChat")
const User = require("../models/user")
const Message = require("../models/message")
class userChatController {
  sendMsgToAdmin = async (req, res) => {
    const { id, message } = req.body
    console.log(req.body)
    const messageObj = await Message.findOne({ userID: id })
    if (!messageObj || !messageObj.chat) {
      res.status(200).json({
        success: false,
        message: "Chưa khởi tạo tin nhắn"
      })
    }
    messageObj.chat.push({
      message,
      time: new Date(),
      senderId: id
    })
    await messageObj.save()
    const userChat = await UserChat.findOne({ userID: id })
    userChat.chat = {
      id,
      lastMessage: { message, time: new Date(), senderId: id },
      unseenMsgs: ++userChat.chat.unseenMsgs
    }
    await userChat.save()
    res.status(200).json({
      message: "Thành công"
    })
  }

  sendMsgToUser = async (req, res) => {
    const { id, message } = req.body
    const messageObj = await Message.findOne({ userID: id })

    messageObj.chat.push({
      message,
      time: new Date(),
      senderId: "admin"
    })
    await messageObj.save()
    const userChat = await UserChat.findOne({ username: id })
    userChat.chat = {
      id,
      lastMessage: { message, time: new Date(), senderId: "admin" },
      unseenMsgs: 0
    }
    await userChat.save()
    res.status(200).json({
      message: "Thành công"
    })
  }

  getChat = async (req, res) => {
    let { id } = req.query

    console.log("id", id)

    const message = await Message.findOne({ userID: id }).exec()
    // console.log("message", message)
    const userChat = await UserChat.findOne({ userID: id }).exec()
    // Get name and data lasted from user
    const userChatReal = await User.findOne({ _id: id }).exec()
    // console.log("userChatReal", userChatReal)
    // console.log("userChat", userChat)

    userChat.chat = {
      ...userChat.chat,
      unseenMsgs: 0
    }
    await userChat.save()

    const userChatNew = {
      ...userChat._doc,
      ...userChatReal._doc
    }
    // console.log("userChatNew", userChatNew)
    res.status(200).json({
      message,
      userChat: userChatNew
    })
  }

  getAllUser = async (req, res) => {
    const userChat = await UserChat.find()
      .sort({ "chat.lastMessage.time": -1 })
      .exec()
    if (!userChat) {
      res.status(200).json({
        message: "Thất bại",
        err: err.message
      })
    }
    const user = await User.find().exec()
    const userChatNew = userChat.map((val) => {
      for (let i = 0; i < user.length; i++) {
        if (String(val.userID) === String(user[i]._id)) {
          return {
            ...val._doc,
            ...user[i]._doc
          }
        }
      }
    })
    res.status(200).json({
      users: userChatNew
    })
  }

  addChatUser = async (req, res) => {
    const userID = req.body.userID
    const check = await UserChat.findOne({ userID: userID }).exec()
    console.log("check", check)
    if (check) {
      res.status(200).json({
        message: "Thất bại"
      })
    } else {
      const userChat = new UserChat({
        userID: userID,
        chat: {
          id: req.body.id,
          unseenMsgs: 0,
          lastMessage: {}
        }
      })
      await new Message({
        userID: userID
      }).save()
      userChat.save().then((resulst) => {
        res.status(200).json({
          message: "Thành công",
          resulst
        })
      })
    }
  }
}

module.exports = new userChatController()
