const { JWTVerify } = require("../helper/JWT")
const Receipt = require("../models/receipt")
const User = require("../models/user")
class ReceiptController {
  getUserReceipt = async (req, res) => {
    try {
      var ObjectId = require("mongodb").ObjectId
      const { id } = res.locals.data
      const userID = new ObjectId(id)

      Receipt.find({ creater: userID })
        .sort({ createdAt: -1 })
        .exec()
        .then((data) => {
          res.status(200).send(
            JSON.stringify({
              data: data
            })
          )
        })
        .catch((error) => {
          res.status(404).send(error)
        })
    } catch (error) {
      res.status(404).send(error.message)
    }
  }

  getList = async (req, res) => {
    const params = req.query
    // console.log({ params });
    Receipt.find(params)
      .sort({ createdAt: -1 })
      .exec()
      .then((data) => {
        res.status(200).send(
          JSON.stringify({
            data: data
          })
        )
      })
      .catch((error) => {
        res.status(404).send(error)
      })
  }

  getOne = async (req, res) => {
    Receipt.findById(req.params.id)
      .populate("creater")
      .then((product) => {
        res.status(200).send(
          JSON.stringify({
            data: product
          })
        )
      })
      .catch((error) => {
        res.status(404).send(error)
      })
  }

  create = async (req, res) => {
    try {
      const receipt = req.body
      const authorizationHeader = req.headers["authorization"]
      if (authorizationHeader) {
        const token = authorizationHeader?.split(" ")[1]
        const reqData = JWTVerify(token)
        receipt.creater = reqData.decoded.id
      }

      const _receipt = new Receipt({
        ...receipt
      })
      _receipt.save()
      User.updateOne({ _id: _receipt.creater }, { cart: [] }).exec()
      res.status(200).send(JSON.stringify({ data: _receipt }))
    } catch (error) {
      res.status(404).send(error.message)
    }
  }

  update = async (req, res) => {
    const id = req.params.id
    const receipt = req.body
    // console.log({ id, receipt })

    Receipt.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          ...receipt
        }
      },
      {
        returnOriginal: false
      },
      function (err, data) {
        // console.log({ err, data })
        if (err) {
          res.status(404).send(err)
        } else {
          res.status(200).send(JSON.stringify({ data }))
        }
      }
    )
  }

  _delete = async (req, res) => {
    Receipt.deleteOne({ _id: req.params.id }, function (err, data) {
      // console.log({ err, data })
      if (err) {
        res.status(404).send(err)
      } else {
        res
          .status(200)
          .send(JSON.stringify({ message: "Delete Successfully", data }))
      }
    })
  }
}

module.exports = new ReceiptController()
