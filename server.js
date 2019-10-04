//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//konfigurasi koneksi
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'challenge'
});

//connect ke database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
app.use('/asset', express.static('asset'))
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//route untuk homepage
app.get('/', (req, res) => {
    let sql = "SELECT * FROM barang";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', {
            results: results
        });
    });
});

//route untuk tambah
app.post('/save', (req, res) => {
    let data = {
        kode_barang: req.body.kode_barang,
        nama_barang: req.body.nama_barang,
        harga: req.body.harga
    };
    let sql = "INSERT INTO barang SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route untuk Edit
app.post('/update', (req, res) => {
    let sql = "UPDATE barang SET kode_barang='" + req.body.kode_barang + "', nama_barang='" + req.body.nama_barang + "', harga='" + req.body.harga + "' WHERE id_barang=" + req.body.id_barang;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//route untuk Hapus
app.post('/delete', (req, res) => {
    let sql = "DELETE FROM barang WHERE id_barang=" + req.body.id_barang + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//server
app.listen(8000, () => {
    console.log('Server is running at port 8000');
});