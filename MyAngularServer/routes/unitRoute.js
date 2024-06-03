const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController.js");

router.get("/unit", unitController.getAll);

router.post("/create_payment_url", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  //   let createDate = moment(date).format("YYYYMMDDHHmmss");
  let createDate = "123";

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  //   let config = require("config");

  // let tmnCode = config.get("vnp_TmnCode");
  let tmnCode = "7B2D2BHL";
  let secretKey = "IGZGWPRRUPZXSJUENHQENVVCKAULHNSD";
  let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let returnUrl = "http://localhost:3000/";
  let orderId = req.body.orderId;
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount; //Số tiền
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  res.set("Content-Type", "text/html");
  res.send(JSON.stringify(vnpUrl));
});

router.get("/vnpay_return", function (req, res, next) {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  //   let config = require("config");
  //   let tmnCode = config.get("vnp_TmnCode");
  //   let secretKey = config.get("vnp_HashSecret");
  let tmnCode = "7B2D2BHL";
  let secretKey = "IGZGWPRRUPZXSJUENHQENVVCKAULHNSD";

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    // const orderId = req.query.vnp_TxnRef;
    // con.connect(function (err) {
    //   if (err) throw err;
    //   const sql = "UPDATE `order` SET state = ? WHERE order_id = ?";
    //   con.query(sql, ["banked", orderId.toString()]);
    //   con.end();
    // });

    res.send("success");
    // res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success2", { code: "97" });
  }
});

// Vui lòng tham khảo thêm tại code demo

module.exports = router;
