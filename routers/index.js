const authRouter = require("./auth")
const productRouter = require("./product")
const newsRouter = require("./news")
const receiptRouter = require("./receipt")
const bannerRouter = require("./banner")
const userRouter = require("./user")
const dashboardRouter = require("./dashboard")
const userChatRouter = require("./userChat")

function route(app) {
  app.use("/api/auth", authRouter)
  app.use("/api/user", userRouter)
  app.use("/api/product", productRouter)
  app.use("/api/news", newsRouter)
  app.use("/api/receipt", receiptRouter)
  app.use("/api/banner", bannerRouter)
  app.use("/api/dashboard", dashboardRouter)
  app.use("/api/user-chat", userChatRouter)
}

module.exports = route
