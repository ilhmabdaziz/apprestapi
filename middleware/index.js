const express = require('express');
var auth = require('./auth');
// const verifikasi = require('./verifikasi');
var router = express.Router();
var verifikasi = require('./verifikasi');

//daftarkan menu registrasi
router.post('/api/v1/register', auth.registrasi);
router.post('/api/v1/login', auth.login);
/// 4 router.post('/api/v1/ubahpassword', verifikasi(1), auth.ubahPassword);

/// 5 router.get('/verify', auth.verifikasi);

//alamat yang perlu otorisasi
router.get('/api/v1/rahasia', verifikasi(), auth.halamanrahasia);

module.exports = router;