const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
  id: String,
  userID: String,
  unseenMsgs: {
    type: Number,
    default: 0
  },
  chat: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model("message", messageSchema)
