"use strict";
var response = require("./res");
var connection = require("./koneksi");

exports.index = function (req, res) {
  response.ok("Aplikasi apprestapi is running!", res);
};

//menampilkan semua data mahasiswa
exports.tampilsemuamahasiswa = function (req, res) {
  connection.query("SELECT * FROM mahasiswa", function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      response.ok(rows, res);
    }
  });
};

//menampilkan semua data mahasiswa bardasarkan id
exports.tampilberdasarkanid = function (req, res) {
  let id = req.params.id;
  // console.log(id);
  connection.query(
    "SELECT * FROM mahasiswa WHERE id_mahasiswa = ?",
    [id],
    function (error, rows, field) {
      if (!error) {
        // console.log(rows.length);
        if (rows.length === 0) {
          response.notOk(`Data tidak ditemukan dengan id = ${id}`, res);
        } else {
          response.ok(rows, res);
        }
      } else {
        console.log(error);
      }
    }
  );
};

//menambahkan data mahasiswa
exports.tambahmahasiswa = function (req, res) {
  var nim = req.body.nim;
  var nama = req.body.nama;
  var jurusan = req.body.jurusan;

  connection.query(
    "INSERT INTO mahasiswa (nim,nama,jurusan) VALUES(?,?,?)",
    [nim, nama, jurusan],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok("Berhasil Menambahkan Data !", res);
      }
    }
  );
};

//mengubah data berdasarkan id
exports.ubahmahasiswa = function (req, res) {
  var id = req.body.id_mahasiswa;
  var nim = req.body.nim;
  var nama = req.body.nama;
  var jurusan = req.body.jurusan;

  connection.query(
    "UPDATE mahasiswa SET nim=?, nama=?, jurusan=? WHERE id_mahasiswa=?",
    [nim, nama, jurusan, id],
    function (error, rows, fields) {
      if (!error) {
        // console.log(rows.affectedRows);
        if (rows.affectedRows === 0) {
          response.notOk(`Data dengan id=${id} tidak ditemukan!!!`, res);
        } else {
          response.ok(`berhasil Ubah Data dengan id = ${id}`, res);
        }
      } else {
        console.log(error);
      }
    }
  );
};

//menghapus data berdasarkan id
exports.hapusmahasiswa = function (req, res) {
  var id = req.body.id_mahasiswa;

  connection.query(
    "DELETE FROM mahasiswa WHERE id_mahasiswa=?",
    [id],
    function (error, rows, fields) {
      if (!error) {
        // console.log(rows.affectedRows);
        if (rows.affectedRows === 0) {
          response.notOk(`Data dengan id=${id} tidak ditemukan!!!`, res);
        } else {
          response.ok(`Berhasil hapus data dengan id = ${id}`, res);
        }
      } else {
        console.log(error);
      }
    }
  );
};

//menampilkan matakuliah group
exports.tampilgroupmatakuliah = function (req, res) {
  connection.query(
    "SELECT mahasiswa.id_mahasiswa, mahasiswa.nim, mahasiswa.nama, mahasiswa.jurusan, matakuliah.matakuliah, matakuliah.sks FROM krs JOIN matakuliah JOIN mahasiswa WHERE krs.id_matakuliah = matakuliah.id_matakuliah AND krs.id_mahasiswa = mahasiswa.id_mahasiswa ORDER BY mahasiswa.id_mahasiswa",
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.oknested(rows, res);
      }
    }
  );
};
