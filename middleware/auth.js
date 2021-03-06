var connection = require("../koneksi");
var mysql = require("mysql");
var md5 = require("md5");
var response = require("../res");
var jwt = require("jsonwebtoken");
var config = require("../config/secret");
var ip = require("ip");
// var nodemailer = require('nodemailer')

// let smtpTransport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//          user: "reactjstutorialindonesia@gmail.com",
//          pass: "Reactjs2020"
//     }
// })

// var rand, mailOptions, host, link
// exports.verifikasi
// exports.ubahPassword

//controller untuk register
exports.registrasi = function (req, res) {
  var post = {
    username: req.body.username,
    email: req.body.email,
    password: md5(req.body.password),
    role: req.body.role || 3,
    tanggal_daftar: new Date(),
    isVerified: 0,
  };

  var query = "SELECT ?? FROM ?? WHERE ??=?";
  var table = ["email", "user", "email", post.email];

  query = mysql.format(query, table);

  connection.query(query, function (error, rows) {
    if (error) {
      console.log(error);
    } else {
      // console.log(rows);
      if (rows.length == 0) {
        var query = "INSERT INTO ?? SET ?";
        var table = ["user"];
        query = mysql.format(query, table);
        connection.query(query, post, function (error, rows) {
          if (error) {
            console.log(error);
          } else {
            response.ok("Berhasil menambahkan data user baru", res);
          }
        });
      } else {
        response.ok("Email sudah terdaftar!", res);
      }
    }
  });
};

// controller untuk login
exports.login = function (req, res) {
  var post = {
    email: req.body.email,
    password: req.body.password,
  };

  var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
  var table = ["user", "password", md5(post.password), "email", post.email];

  query = mysql.format(query, table);
  // console.log(query);
  connection.query(query, function (error, rows) {
    if (error) {
      console.log(error);
    } else {
      // console.log(rows);
      if (rows.length == 1) {
        var token = jwt.sign({ rows }, config.secret, {
          expiresIn: "2400000",
        });
        // console.log(token);
        id_user = rows[0].id;
        //1 tambahan row username
        username = rows[0].username;
        //2 tambahan row role
        role = rows[0].role;

        var expired = 2400000;
        var isVerified = rows[0].isVerified;

        var data = {
          id_user: id_user,
          access_token: token,
          ip_address: ip.address(),
        };

        var query = "INSERT INTO ?? SET ?";
        var table = ["akses_token"];

        query = mysql.format(query, table);
        connection.query(query, data, function (error, rows) {
          if (error) {
            console.log(error);
          } else {
            res.json({
              success: true,
              message: "Token JWT tergenerate!",
              token: token,
              currUser: data.id_user,
              //4 tambahkan expired time
              expires: expired,
              user: username,
              //3 tambahkan role
              role: role,
              isVerified: isVerified,
            });
          }
        });
      } else {
        res.json({ Error: true, Message: "Email atau Password Salah!" });
      }
    }
  });
};

exports.halamanrahasia = function (req, res) {
  response.ok(
    "Selamat Datang !!!!, Halaman ini hanya untuk user dengan role = 2!",
    res
  );
};
