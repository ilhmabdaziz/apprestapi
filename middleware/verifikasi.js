// const { response } = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config/secret");

//!coba lah
const mysql = require("mysql");
const connection = require("../koneksi");
const ip = require("ip");

function verifikasi() {
  return function (req, rest, next) {
    var role = req.body.role;
    //cek authorizzation header
    var tokenWithBearer = req.headers.authorization;
    // console.log(tokenWithBearer);
    if (tokenWithBearer) {
      var token = tokenWithBearer.split(" ")[1];
      // console.log(token);
      //verifikasi
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          return rest
            .status(401)
            .send({ auth: false, message: "Token tidak terdaftar!" });
        } else {
          if (role == 2) {
            req.auth = decoded;
            // console.log(req.auth);
            // console.log(req.auth.rows[0].id);
            // console.log(req.auth.exp);
            let date = new Date();
            let data = {
              id_user: req.auth.rows[0].id,
              username: req.auth.rows[0].username,
              date_time: date.toLocaleString("en-US"),
              expires: req.auth.exp - req.auth.iat,
              ip_address: ip.address(),
            };
            let query = "INSERT INTO ?? SET ?";
            let table = ["enter_role_2"];
            query = mysql.format(query, table);
            // console.log(data);
            connection.query(query, data, (err, rows) => {
              if (err) {
                console.log(err);
              } else {
                next();
              }
            });
            // next();
          } else {
            return rest
              .status(401)
              .send({ auth: false, message: "Gagal mengotorisasi role anda!" });
          }
        }
      });
    } else {
      return rest
        .status(401)
        .send({ auth: false, message: "Token tidak tersedia!" });
    }
  };
}

module.exports = verifikasi;
