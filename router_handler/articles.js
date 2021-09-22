// 导入sqlite3
const sqlite3 = require('sqlite3').verbose();
// 连接数据库
const db = new sqlite3.Database('article.db', (err) => {
    if (err) {
        throw err
    }
});
// 导入path
const path = require('path');

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    console.log(req.body);
    db.run('insert into articles(title,content,pub_data,state,id_delete,cate_id,author_id) values(?,?,?,?,?,?,?)', [
        req.body.title, req.body.content, new Date(), req.body.state, 0, req.body.cate_id, req.user.id
    ], (err) => {
        if (this.changes !== 1) {
            return res.send({
                status: 1,
                message: '添加文章失败!'
            })
        }
        else {
            return res.send({
                status: 1,
                message: '添加文章失败!'
            })
        }
    })
}

// 获取文章列表
exports.getArticle = (req, res) => {
    db.all('select * from articles', (err, row) => {
        if (row.length === 0) {
            return res.send({
                status: 1,
                message: '获取文章失败!'
            })
        }
        else {
            return res.send({
                status: 0,
                message: '获取文章成功!',
                data: row
            })
        }
    })
}