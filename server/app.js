const express = require('express')
const session = require("express-session")
const bodyParser = require('body-parser')
const port = 3000
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'CopyBoardSession',   // 加密字符串会通过这个字符串进行加密,自己可以设置
    cookie: { maxAge: 10*60*1000 },   // 设置过期时间,也可以在里面设置其他的想要的cookie属性
    resave: true,   // 即时session 没有被修改, 也保存session值, 默认为true
    saveUninitialized: true, //  无论有没有session cookie 每次请求都设置个session cookie 默认标示为 connect.sid
    rolling: true   // 属性cookie的时间
}))


var data = require('./data/data.js')

app.use('/api/data', data)

app.use(express.static('./dist'))

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})