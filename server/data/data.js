var express = require('express');
var bodyParser = require('body-parser');
var util = require('../utils/util.js');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const session = require("express-session")
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, './db/data.db'));
const fileSavePath = path.join(__dirname, './db/files');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileSavePath); // 设置上传文件的保存路径
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + decodeURIComponent(file.originalname)); // 设置上传文件的文件名
    }
});

const originFilename = (filename) => {
    return filename.split('-').slice(2).join('-');
}

const upload = multer({ storage: storage });

// 创建上传文件的 POST 接口
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.send(util.formatReturn(1, req.file.filename));
});

router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(fileSavePath, filename);

    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        // 发送文件给客户端
        res.download(filePath, decodeURIComponent(originFilename(filename)), (err) => {
            if (err) {
                // 检查响应是否已被发送
                if (!res.headersSent) {
                    return res.status(500).send(util.formatReturn(0, 'Could not download the file'));
                } else {
                    console.error('Error during file download:', err);
                }
            }
        });
    });
});


router.get('/fileList', (req, res) => {
    fs.readdir(fileSavePath, (err, files) => {
        if (err) {
            console.log(err);

            return res.status(500).send(util.formatReturn(0, 'Could not list the directory'));
        }

        res.send(util.formatReturn(1, files));
    });
});

router.get("/copyList", (req, res) => {
    db.all("select * from copy_list", (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
})

router.post("/add", upload.single('file'), (req, res) => {
    const { title, content, author } = req.body;
    const file = req.file ? req.file.filename : null;  // 检查文件是否存在
    var timestamp = new Date().getTime();

    db.run("insert into copy_list (title, content, author, created_time, file_path, filename) values (?, ?, ?, ?, ?, ?)",
        [title, content, author, parseInt(timestamp), file, file ? decodeURIComponent(originFilename(file)) : null],
        (err) => {
            if (err) throw err;
            res.send(util.formatReturn(1, "success"));
        }
    );
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

    // 首先获取与该记录关联的文件名
    db.get("SELECT file_path FROM copy_list WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).send(util.formatReturn(0, "Database query error"));
        }

        if (!row) {
            return res.status(404).send(util.formatReturn(0, "Record not found"));
        }

        const filePath = row.file_path ? path.join(fileSavePath, row.file_path) : null;

        // 如果文件存在，先删除文件
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).send(util.formatReturn(0, "Failed to delete the file"));
                }

                // 删除记录
                db.run("DELETE FROM copy_list WHERE id = ?", [id], (err) => {
                    if (err) {
                        return res.status(500).send(util.formatReturn(0, "Failed to delete the record"));
                    }
                    res.send(util.formatReturn(1, "Record and file deleted successfully"));
                });
            });
        } else {
            // 文件不存在或记录没有关联文件，仅删除记录
            db.run("DELETE FROM copy_list WHERE id = ?", [id], (err) => {
                if (err) {
                    return res.status(500).send(util.formatReturn(0, "Failed to delete the record"));
                }
                res.send(util.formatReturn(1, "Record deleted successfully, no file to delete"));
            });
        }
    });
});

router.get("/isLogin", (req, res) => {
    try {
        if (req.session.user == 'admin') {
            res.send(util.formatReturn(1));
        } else {
            res.send(util.formatReturn(0));
        }
    } catch {
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
    if (pwd != cfmPwd) res.send(util.formatReturn(0, "err_cfmPwd"))
    db.run("update admin set pwd = ? where user = ?", [pwd, 'admin'], (err) => {
        if (err) throw err;
        req.session.user = '';
        res.send(util.formatReturn(1, "success"));
    })
})

module.exports = router;