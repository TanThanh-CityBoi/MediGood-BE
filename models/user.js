const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    phone: String,
    gender: Number, // 1 nam, 2 nữ, 3 khác
    role: String,
    emailVerified: Boolean,
    address: [
      {
        district: Object, // Quận
        province: Object, // Tỉnh/TP
        ward: Object, // Phường
        description: String, // Địa chỉ cụ thể
        name: String, // tên người nhận
        phone: String, // Số điện thoại
      },
    ],
    avatar: String,
    birthday: Date,
    cart: [
      {
        quantity: Number,
        product: { type: Schema.Types.ObjectId, ref: "product" }, // Lưu trữ ID nha người anh em :))
      },
    ],
    receipts: [{ type: Schema.Types.ObjectId, ref: "receipt" }], // lấy lịch sử mua hàng
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
