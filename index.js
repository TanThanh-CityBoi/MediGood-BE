const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./configDB") // connect MongoDB
const PORT = process.env.PORT || 5000 // port number
const app = express()
const route = require("./routers/index") // router impl
var morgan = require("morgan")
const message = require("./models/message")
app.use(morgan("combined"))
const http = require("http").Server(app)

// Socketio
const io = require("socket.io")(http, {
  cors: {
    credentials: true,
    origin: true,
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"]
  },
  allowEIO3: true
})

const users = {
  user: []
}

const addUser = (id) => {
  const user = users.user.filter((user) => user.id === id)
  console.log(user)
  if (user.length === 0) {
    users.user.push({
      id
    })
  }
}

const deleteUser = (id) => {
  users.user = users.user.filter((user) => user.id !== id)
}

io.on("connection", (socket) => {
  console.log("someone connected " + socket.id)
  addUser(socket.id)

  socket.on("setName", (fullname) => {
    users.user = users.user.map((user) => {
      if (user.id === socket.id) {
        user.fullname = fullname
      }
      return user
    })
    console.log(users)
  })

  socket.on("sendMessageToAdmin", (message) => {
    const user = users.user.filter((user) => user.id === socket.id)
    io.emit("getMessageFromUser", { message, user })
  })

  socket.on("sendMessageToUser", (val) => {
    io.emit("getMessageFromAdmin", { message: val.message, userID: val.user })
  })

  socket.on("disconnect", () => {
    console.log("someone disconnected " + socket.id)
    deleteUser(socket.id)
  })
})

//some middleware
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use(
  cors({
    credentials: true,
    origin: true
  })
)

//connect to MongoDB
connectDB()
// pass app into router
route(app)

//app listen
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
