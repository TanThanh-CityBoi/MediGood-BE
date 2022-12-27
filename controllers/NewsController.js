const News = require("../models/news")

class NewsController {
  getList = async (req, res) => {
    // console.log("Vô nhầm route")
    News.find()
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
    News.findById(req.params.id)
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
    const news = req.body
    const _news = new News({
      ...news
    })

    // console.log("debug 2", _news);
    _news
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
    const news = req.body

    News.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          ...news
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
    News.deleteOne({ _id: req.params.id }, function (err, data) {
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
module.exports = new NewsController()
