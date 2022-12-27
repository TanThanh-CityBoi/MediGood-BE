const User = require("../models/user")
const Token = require("../models/emailtoken")
const { JWTAuthToken } = require("../helper/JWT")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")
const bcrypt = require("bcrypt")
const { verify } = require("jsonwebtoken")
const saltRounds = 10

class AuthController {
  register = async (req, res) => {
    const email = req.body.email
    const password = bcrypt.hashSync(req.body.password, saltRounds)
    const name = req.body.name
    const address = req.body.address
    const phone = req.body.phone
    const role = "user"
    const emailVerified = false
    const cart = []
    const avatar = "/default-avatar"
    const receipts = []
    const birthday = req.body.birthday
    // console.log({ email, password });

    User.findOne({ email: email })
      .exec()
      .then((data) => {
        if (data) {
          res.status(409).send(
            JSON.stringify({
              message: "Username has been used"
            })
          )
        } else {
          const newUser = new User({
            email,
            password,
            name,
            phone,
            role,
            emailVerified,
            avatar,
            birthday,
            cart,
            receipts,
            address
          })

          newUser.save().then((data) => {
            res.status(201).send(
              JSON.stringify({
                message: "Sign up successfully",
                token: JWTAuthToken({
                  email,
                  id: data._id
                }),
                email,
                data
              })
            )

            const token = new Token({
              email: email,
              token: crypto.randomBytes(32).toString("hex")
            })
              .save()
              .then((data) => {
                // console.log("tokennnnn: ", data)
                const url = `${process.env.FE_URL}/xac-nhan-email/${email}/${data.token}`
                sendEmail(email, "Verify Email", url)
              })
          })
        }
      })
      .catch((err) => {
        res.send(
          JSON.stringify({
            status: -1,
            message: err.message
          })
        )
      })
  }
  //---------------------------------------------------------------LOGIN--------------------------------------------------------------------------//
  login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // console.log({ email, password })
    User.findOne({ email: email })
      .exec()
      .then((data) => {
        // console.log({ data })
        //check password, if password is correct then get all data and respond for client
        if (bcrypt.compareSync(password, data.password)) {
          const { password, ...user } = data._doc

          res.status(200).send(
            JSON.stringify({
              message: "Login successfully",
              user: user,
              token: JWTAuthToken({ email: user.email, id: user._id })
            })
          )
        } else {
          throw new Error()
        }
      })
      .catch((err) => {
        res.status(401).send(
          JSON.stringify({
            message: "Login error, wrong email or password"
          })
        )
      })
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------//
  refresh = async (req, res) => {
    // console.log("Access to auth controller success")
    res.status(200).send(
      JSON.stringify({
        status: "HIIH",
        message: "This is message",
        token: "This is token",
        email: "This is email",
        data: res.locals.data
      })
    )
  }

  //----------------------------------------------------verify-email-----------------------------------------------------------------------------//
  verifyEmail = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.id })
      if (!user) return res.status(400).send({ message: "Invalid link" })
      // console.log("user: ", user)
      const token = await Token.findOne({
        email: user.email,
        token: req.params.token
      })
      if (!token) return res.status(400).send({ message: "Invalid link" })

      await User.updateOne({ email: user.email, emailVerified: true })
      await token.remove()

      res.status(200).send({ message: "Email verified successfully" })
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" })
    }
  }
}

module.exports = new AuthController()
