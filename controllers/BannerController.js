const Banner = require("../models/banner")

class BannerController {
  getList = async (req, res) => {
    // console.log("Vô nhầm route")
    Banner.find()
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
    Banner.findById(req.params.id)
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
    const banner = req.body
    const _banner = new Banner({
      ...banner
    })

    // console.log("debug 2", _banner);
    _banner
      .save()
      .then((data) => {
        res.status(200).send(JSON.stringify(data))
      })
      .catch((err) => {
        // console.log(err)
        res.status(404).send(err)
      })
  }

  update = async (req, res) => {
    const id = req.params.id
    const banner = req.body

    Banner.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          ...banner
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
    Banner.deleteOne({ _id: req.params.id }, function (err, data) {
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
module.exports = new BannerController()
