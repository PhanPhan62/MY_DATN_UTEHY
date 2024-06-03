const db = require("../connection");
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment

exports.createOrder = (req, res) => {
  try {
    // Lấy thông tin từ req.body
    const {
      MaKhachHang,
      customerName,
      customerAddress,
      customerPhone,
      customerEmail
    } = req.body;
    const chiTietDonHang = Array.isArray(req.body.chiTietDonHang)
      ? req.body.chiTietDonHang
      : [req.body.chiTietDonHang];
    // Tạo ngày hiện tại
    const NgayDat = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Thêm dữ liệu vào bảng 'donhang'
    const TrangThaiDonHang = "Đang chờ duyệt";
    const orderQuery = `INSERT INTO donhang (MaKhachHang, NgayDat, TrangThaiDonHang) VALUES (?, ?, $${TrangThaiDonHang})`;
    const orderValues = [MaKhachHang, NgayDat];

    db.query(orderQuery, orderValues, (err, result) => {
      if (err) {
        console.error("Lỗi thêm đơn hàng:", err);
        return res.status(500).json({ error: "Đã có lỗi xảy ra." });
      }
      const orderId = result.insertId;

      // Thêm dữ liệu vào bảng 'chitietdonhang' cho từng sản phẩm
      chiTietDonHang.forEach(item => {
        const { productId, quantity, Gia } = item;
        const detailOrderQuery =
          "INSERT INTO chitietdonhang (MaDonHang, MaSanPham, SoLuong, GiaMua, ThanhTien) VALUES (?, ?, ?, ?, ?)";
        const detailOrderValues = [
          orderId,
          productId,
          quantity,
          Gia,
          quantity * Gia
        ];

        db.query(detailOrderQuery, detailOrderValues, err => {
          if (err) {
            console.error("Lỗi thêm chi tiết đơn hàng:", err);
          }
        });

        db.query("CALL CalculateTotalPrice();", (err, results) => {
          if (err) {
            console.error("Lỗi tính tổng giá:", err);
          } else {
            // console.log("Tổng giá đã được tính:", results[0]);
            // You can perform any additional processing here if needed
          }
        });
      });

      // After all operations are done, update customer information
      db.query(
        "UPDATE khachhang SET TenKhachHang = ?, DiaChi = ?, SDT = ?, Email = ? WHERE id = ?",
        [
          customerName,
          customerAddress,
          customerPhone,
          customerEmail,
          MaKhachHang
        ],
        err => {
          if (err) {
            console.error("Lỗi cập nhật thông tin khách hàng:", err);
            return res.status(500).json({ error: "Đã có lỗi xảy ra." });
          }
          // Send response once all operations are completed
          return res.status(200).json({ message: "Tạo đơn hàng thành công" });
        }
      );
    });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ error: "Đã có lỗi xảy ra." });
  }
};

exports.countOrder = (req, res) => {
  db.query(
    "SELECT * FROM donhang WHERE NgayDat >= CURDATE() - INTERVAL 30 DAY and TrangThaiDonHang = 1; ",
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Lỗi", error: err });
      } else {
        res.status(200).json(results);
      }
    }
  );
};
exports.countTotalIncome = (req, res) => {
  db.query(
    "SELECT ctdh.SoLuong, ctdh.GiaMua FROM chitietdonhang ctdh INNER JOIN donhang dh on ctdh.MaDonHang = dh.id WHERE dh.TrangThaiDonHang = 1 ",
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Lỗi", error: err });
      } else {
        res.status(200).json(results);
      }
    }
  );
};
exports.countTotalCost = (req, res) => {
  db.query(
    "SELECT cthdn.SoLuong, cthdn.DonGiaNhap FROM chitiethoadonnhap cthdn INNER JOIN hoadonnhap hdn on cthdn.MaHoaDonNhap = hdn.id ",
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Lỗi", error: err });
      } else {
        res.status(200).json(results);
      }
    }
  );
};
exports.countUsers = (req, res) => {
  db.query("call countUsers", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Lỗi", error: err });
    } else {
      res.status(200).json(results[0]);
    }
  });
};

exports.getAll = (req, res) => {
  db.query("call getDonHang", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Lỗi", error: err });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.zaloPay = async (req, res, next) => {
  // APP INFO
  const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
  };

  const chiTietDonHang = Array.isArray(req.body.chiTietDonHang)
    ? req.body.chiTietDonHang
    : [req.body.chiTietDonHang];

  const embed_data = {
    redirecturl: "https://www.facebook.com/yen.hoang.2903/"
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: 100000, // giá
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url: "http://localhost:3000/callback"
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  try {
    const results = await axios.post(config.endpoint, null, { params: order });
    console.log(chiTietDonHang);
    console.log(results.data);
    next();
  } catch (e) {
    console.log(e.message);
  }
};

exports.callback = async (req, res) => {
  const config = {
    key2: "eG4r0GcoNtRGbO8"
  };

  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};
