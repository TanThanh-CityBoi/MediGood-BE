const Product = require("../models/product");
const Receipt = require("../models/receipt");
const News = require("../models/news");
const User = require("../models/user");
const saltRounds = 10;

class DashBoardController {
  getGeneralReport = async (req, res) => {
    try {
      const productCount = await Product.countDocuments({});
      const newsCount = await News.countDocuments({});
      const receiptCount = await Receipt.countDocuments({ status: 4 });
      const userCount = await User.countDocuments({});

      res.status(200).send(
        JSON.stringify({
          data: {
            productCount,
            newsCount,
            receiptCount,
            userCount,
          },
        })
      );
    } catch (e) {
      res.status(500).send(
        JSON.stringify({
          error: "Something get wrong",
        })
      );
    }
  };

  getTimelyReport = async (req, res) => {
    // try {
    const timeRange = req.query;
    console.log(timeRange);
    const receipt = await Receipt.find({
      createdAt: {
        $gte: timeRange[0],
        $lt: timeRange[1],
      },
      status: 4,
    }).sort({ createdAt: -1 });
    res.status(200).send(
      JSON.stringify({
        data: {
          receipt,
        },
      })
    );
    //   } catch (e) {
    //     console.log(JSON.stringify(e, null, 2));
    //     res.status(500).send(
    //       JSON.stringify({
    //         error: "Something get wrong",
    //       })
    //     );
    //   }
  };
}

module.exports = new DashBoardController();
