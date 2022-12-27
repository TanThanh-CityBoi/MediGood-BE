const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Receipt = new Schema(
  {
    creater: { type: Schema.Types.ObjectId, ref: "user" }, // ID người tạo, nullable
    receiver: {
      name: String,
      phone: String, // required
      province: {},
      district: {},
      ward: {},
      description: String,
      note: String,
    }, // Tên và địa chỉ người nhận hàng.
    cart: [
      {
        product: {}, // này là object product không thay đổi theo giá trị product bên bảng product.
        quantity: Number,
      },
    ],
    totalPrice: Number,
    profit: Number,
    status: Number, //0: bị hủy, 1: chờ xác nhận, 2: đã xác nhận, 3: đang giao. 4: đã nhận hàng, 6: boom hàng
    payMethod: Number, // 1: trả trước, 2: Momo, 3: Ngân hàng
    shippingUnit: String,
    shippingCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("receipt", Receipt);

// const statusList = [
//   { color: "#ff8b60", title: "Đã hủy" },
//   { color: "#ffb246", title: "Chờ xác nhận" },
//   { color: "#ffd84c", title: "Đã xác nhận" },
//   { color: "#a9d78c", title: "Đang giao hàng" },
//   { color: "#6bc8a3", title: "Đã nhận hàng" },
//   { color: "#f00", title: "Không nhận hàng" },
// ];
