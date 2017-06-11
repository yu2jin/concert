var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var client = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '0630',
    database: 'concert',
    multipleStatements: true
});

router.get('/', function(req, res, next) {
    client.query('select * from reservation', function(error, results) {
        res.render('index', {
            reserved: results
        });
    });
});

router.get('/reserve', function(req, res) {
    var id = req.query.id;
    client.query('select * from reservation where id = ?',
        [id], function(error, results) {
            res.render('reserve', {
                data: results[0]
            });
        });
});

router.post('/reserve', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var phone = req.body.phone;
    var password = req.body.password;
    client.query('update reservation set name = ?, phone = ?, password = ? reserved = ? where id = ?',
        [name, phone, password, 1, id],
        function(error, results) {
            if(!error) res.redirect("/");
        });
});

router.post('/isReserved', function(req, res, next) {
    var id = req.body.id;
    client.query('select * from reservation where id= ?', [id], function(error, results) {
        if(!error) res.send(results[0]['RESERVATED']);
    });
});

router.get('/cancel', function(req, res) {
    var id = req.query.id;
    client.query('select * from reservation where id= ?', [id],
        function(error, results) {
        res.render('cancel', {
            data: results[0]
        });
    });
});

router.post('/cancel', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;
    var name = req.body.name;
    client.query('select * from reservation where id= ?', [id], function(error, results) {
            if(password == results[0]['PASSWORD'] && name == results[0]['NAME']){
                client.query('update reservation set name=?, phone=?, password=?, reservated=? where id= ?',
                    [ null, null, null,0, id],
                    function(error, results) {
                    if(!error) res.redirect("/");
                });
            } else {
                res.send("<h1>정보가 일치하지 않아 취소할 수 없습니다.</h1>");
            }
        });
});

router.get('/status', function(req, res, next) {
    client.query('select * from reservation where reservated = ?', [1],
        function(error, results) {
        res.render('status', {
            data: results
        });
    });
});

module.exports = router;
