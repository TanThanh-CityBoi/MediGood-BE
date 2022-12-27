const Product = require("../models/product")
const FilterConverter = require("../utils/filterConverter")

class ProductController {
  getList = async (req, res) => {
    const { query } = req
    const queryElement = []
    if (query) {
      if (query.category && query.category.length != 0) {
        const querryPrice = FilterConverter.multipleValuesFilter(
          "category",
          query.category
        )
        queryElement.push(querryPrice)
      }
      if (query.price) {
        const querryPrice = FilterConverter.rangeFilter("price", query.price)
        queryElement.push(querryPrice)
      }
      if (query.producer && query.producer.length != 0) {
        const querryPrice = FilterConverter.multipleValuesFilter(
          "producer",
          query.producer
        )
        queryElement.push(querryPrice)
      }
      if (query.age) {
        const querryAge = FilterConverter.rangeFilterV2("age", query.age)
        queryElement.push(querryAge)
      }
    }

    // console.log("========= query element =======");
    // console.log(
    //   JSON.stringify(FilterConverter.combineFilter(queryElement), null, 2)
    // )

    Product.find(FilterConverter.combineFilter(queryElement))
      .sort({ createdAt: -1 })
      .exec()
      .then((data) => {
        res.status(200).send(JSON.stringify({ data }))
      })
      .catch((error) => {
        res.status(404).send(error)
      })
  }

  getListAccessary = async (req, res) => {
    const query = {
      productType: { $eq: "accessary" }
    }
    Product.find(query)
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
    Product.findById(req.params.id)
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
    const product = req.body
    const _product = new Product({
      ...product,
      isSaleProduct: product.price < product.originPrice
    })

    // console.log("debug 2", _product)
    _product
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
    const product = req.body
    if (product.price < product.originPrice) {
      product.isSaleProduct = true
    } else {
      product.isSaleProduct = false
    }

    Product.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          ...product
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

  deleteMany = async (req, res) => {
    res.status(200).send("Hihi delete many")
  }

  _delete = async (req, res) => {
    Product.deleteOne({ _id: req.params.id }, function (err, data) {
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

  getProductsInCart = async (req, res) => {
    try {
      const cart = req.body.cart
      var ObjectId = require("mongodb").ObjectId

      const listID = cart.map((item) => {
        var _oID = new ObjectId(item.product)
        return _oID
      })
      const products = await Product.find({ _id: { $in: listID } }).exec()
      const data = products.map((item) => {
        var cartItem = { product: item, quantity: 0 }
        cart.forEach((element) => {
          var _oID = new ObjectId(element.product)
          if (_oID.toString() === item._id.toString())
            cartItem.quantity = element.quantity
        })
        return cartItem
      })
      res.status(200).send(
        JSON.stringify({
          data: data
        })
      )
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
}

module.exports = new ProductController()
