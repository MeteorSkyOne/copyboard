var express = require('express');
var bodyParser = require('body-parser');
var util = require('../utils/util.js');
var router = express.Router();
const path = require('path');
const session = require("express-session")
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, './db/data.db'));


router.get("/copyList", (req, res) => {
    db.all("select * from copy_list", (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
})

router.post("/add", (req, res) => {
    const { title, content, author } = req.body;
    var timestamp = new Date().getTime();
    db.run("insert into copy_list (title, content, author, created_time) values (?, ?, ?, ?)", [title, content, author, parseInt(timestamp)], (err) => {
        if (err) throw err;
        res.send(util.formatReturn(1, "success"));
    });
})

router.post("/login", (req, res) => {
    const { pwd } = req.body;
    db.all("select * from admin where user = ? and pwd = ?", ['admin', pwd], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            req.session.user = 'admin';
            res.send(util.formatReturn(1));
        } else {
            res.send(util.formatReturn(0, "err_pwd"));
        }
    });
})

router.post("/remove", (req, res) => {
    const { id } = req.body;
    db.run("delete from copy_list where id = ?", [id], (err) => {
        if (err) throw err;
        res.send(util.formatReturn(1, "success"));
    })
})

router.get("/isLogin", (req, res) => {
    try{
        if (req.session.user == 'admin') {
            res.send(util.formatReturn(1));
        } else {
            res.send(util.formatReturn(0));
        }
    }catch{
        res.send(util.formatReturn(0));
    }
})

router.post("/save", (req, res) => {
    const { id, title, content } = req.body;
    db.run("update copy_list set title = ?, content = ? where id = ?", [title, content, id], (err) => {
        if (err) throw err;
        res.send(util.formatReturn(1, "success"));
    })
})

router.post("/chgPwd", (req, res) => {
    const { pwd, cfmPwd } = req.body;
    if(pwd != cfmPwd) res.send(util.formatReturn(0, "err_cfmPwd"))
    db.run("update admin set pwd = ? where user = ?", [pwd, 'admin'], (err) => {
        if(err) throw err;
        req.session.user = '';
        res.send(util.formatReturn(1, "success"));
    })
})

module.exports = router;