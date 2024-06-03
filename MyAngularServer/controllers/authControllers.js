const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Key = require("../secretKey");

exports.checkToken = (req, res, next) => {
  const token = req.headers.token;
  // console.log(token);

  if (token) {
    const secretKey = Key;
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.json({ message: "Token không hợp lệ", token });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).json({ message: "Không tìm thấy token" });
  }
};

exports.login = async (req, res) => {
  const { TaiKhoan, MatKhau } = req.body;

  if (!TaiKhoan || !MatKhau) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp tài khoản và mật khẩu" });
  }

  db.query(
    "SELECT * FROM taikhoan WHERE TaiKhoan = ?",
    [TaiKhoan],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi đăng nhập", error: err });
      }

      if (results.length <= 0) {
        return res.json({ message: "Tài khoản không tồn tại" });
      }
      const {
        idResults,
        MaNhanVienResult,
        TaiKhoanResult,
        MatKhauResult,
        NgayBatDauResult,
        NgayKetThucResult,
        TrangThaiResult,
        MaKhachHang,
        LoaiQuyenResult
      } = results[0];

      const idResults1 = results[0].MaKhachHang;
      const hashedPassword = results[0].MatKhau;
      const hashedRole = results[0].LoaiQuyen;

      try {
        const isMatch = await bcrypt.compare(MatKhau, hashedPassword);

        if (isMatch) {
          const secretKey = Key;
          const accessToken = jwt.sign(
            {
              id: idResults,
              user: TaiKhoanResult,
              Role: LoaiQuyenResult
            },
            secretKey,
            { expiresIn: "3d" }
          );

          if (hashedRole === "customer" || hashedRole === "admin") {
            // console.log(accessToken);
            const querykhachhangByID = `SELECT id, TenKhachHang, DiaChi, SDT, Email FROM khachhang where id = ${idResults1}`;

            db.query(querykhachhangByID, (err, clientData) => {
              if (err) {
                return res.status(200).json({ message: "Lỗi", error: err });
              } else {
                // results = [results.push(clientData)];
                // console.log(results);

                return res.status(200).json({
                  message: "Đăng nhập thành công",
                  accessToken,
                  results,
                  clientData
                });
              }
            });
          } else {
            return res.status(200).json({ message: "Đăng nhập thất bại" });
          }
        } else {
          res.status(200).json({ message: "Mật khẩu không chính xác" });
        }
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi so sánh mật khẩu", error });
      }
    }
  );
};

exports.register = async (req, res) => {
  const { addMonths, format } = require("date-fns");
  const ngayBatDau = new Date();
  const formattedNgayBatDau = ngayBatDau.toISOString().slice(0, 10);
  const { TaiKhoan, MatKhau } = req.body;
  const salt = await bcrypt.genSalt(10);

  const hashedMatKhau = await bcrypt.hash(MatKhau, salt);

  db.query(
    "SELECT * FROM taikhoan WHERE TaiKhoan = ?",
    [TaiKhoan],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi tạo tài khoản", error: err });
      }

      if (results && results[0] && results[0].TaiKhoan === TaiKhoan) {
        res.json({ message: "Tài khoản đã tồn tại" });
      } else {
        const [TenKhachHang, DiaChi, SDT, Email] = [null, null, null, null];

        db.query(
          "insert into khachhang (`TenKhachHang`, `DiaChi`, `SDT`, `Email`) values( ?, ?, ?, ?);",
          [TenKhachHang, DiaChi, SDT, Email],
          (err, results) => {
            if (err) {
              console.log("Lỗi: ", err);
            } else {
              const Khachhangid = results.insertId;
              const registerQuery =
                "insert into taikhoan ( `MaNhanVien`, `MaKhachHang` , `TaiKhoan`,  `MatKhau`,  `NgayBatDau`,  `NgayKetThuc`,  `TrangThai`,  `LoaiQuyen` ) values (?,?,?,?,?,?,?,?);";
              db.query(
                registerQuery,
                [
                  null,
                  Khachhangid,
                  TaiKhoan,
                  hashedMatKhau,
                  formattedNgayBatDau,
                  null,
                  1,
                  "customer"
                ],
                (err, results) => {
                  if (err) {
                    res.status(500).json({ error: err });
                  } else {
                    res.json({ message: "Tài khoản được tạo thành công" });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

exports.loginKH = (req, res) => {
  const { TaiKhoan, MatKhau } = req.body;
  if (!TaiKhoan || !MatKhau) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp tài khoản và mật khẩu" });
  }
  db.query(
    "SELECT * FROM taikhoankhachhang WHERE TaiKhoan = ?",
    [TaiKhoan.trim()],
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Lỗi đăng nhập", error: err });
      } else {
        if (results.length === 0) {
          res.json({ message: "Tài khoản không tồn tại" });
        } else {
          const hashedPassword = results[0].MatKhau;
          const hashedRole = results[0].LoaiQuyen;
          console.log(results[0]);
          // console.log(hashedRole);
          // bcrypt.compare(MatKhau, hashedPassword, (bcryptErr, isMatch) => {
          if (MatKhau == hashedPassword) {
            // if (hashedRole === 'admin' || hashedRole === 'staff') {
            //     res.status(200).json({ message: 'Đăng nhập thành công chào admin, nhân viên' });
            if (hashedRole === "custumer") {
              res
                .status(200)
                .json({ message: "Đăng nhập thành công", results });
            }
          } else {
            res.status(200).json({ message: "Mật khẩu không chính xác" });
          }
          // });
        }
      }
    }
  );
};
