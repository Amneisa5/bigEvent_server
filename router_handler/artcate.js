// 导入sqlite3
const sqlite3 = require('sqlite3').verbose();
// 连接数据库
const db = new sqlite3.Database('article_cate.db', (err) => {
    if (err) {
        throw err
    }
});

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    db.all('select * from article_cate where is_delete=0 order by id asc', (err, row) => {
        if (err) {
            return res.send({
                status: 1,
                message: '获取文章分类列表失败！',
            })
        }
        else {
            return res.send({
                status: 0,
                message: '获取文章分类列表成功！',
                data: row
            })
        }
    });
}
// 新增文章分类
exports.addArticleCates = (req, res) => {
    // 查询文章分类是否存在
    db.all('select * from article_cate where name=? or alias=?', [req.body.name, req.body.alias], (err, row) => {
        if (row.length !== 0) {
            return res.send({
                status: 1,
                message: '当前文章分类已存在！'
            })
        }
        else {
            db.run('insert into article_cate(name,alias,is_delete) values(?,?,?)', [req.body.name, req.body.alias, 0], (err) => {
                if (this.changes > 1) {
                    return res.send({
                        status: 1,
                        message: "插入文章分类失败！"
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: "插入文章分类成功！"
                    })
                }
            });
        }
    })
}
// 根据id删除文章
exports.deleteCateById = (req, res) => {
    db.run('update article_cate set is_delete=1 where id=?', req.params.id, (err) => {
        if (this.changes > 1) {
            return res.send({
                status: 1,
                message: '删除文章分类失败！'
            })
        }
        else {
            return res.send({
                status: 0,
                message: '删除文章分类成功！'
            })
        }
    })
}
// 根据id获取文章
exports.getArtCateById = (req, res) => {
    db.all('select * from article_cate where id=?', [req.params.id], (err, row) => {
        if (row.length !== 1) {
            return res.send({
                status: 1,
                message: '获取文章分类失败!'
            })
        }
        else {
            return res.send({
                status: 0,
                message: '获取文章分类成功!',
                data: row[0]
            })
        }
    })
}
// 根据id更新文章分类
exports.updateCateById = (req, res) => {
    db.all('select * from article_cate where id!=? and (name=? or alias=?)', [req.body.id, req.body.name, req.body.alias], (err, row) => {
        if (row.length !== 0) {
            return res.send({
                status: 1,
                message: '当前文章分类已存在!'
            })
        }
        else {
            db.run('update set article_cate name=?,alias=? where id=?', [req.body.name, req.body.alias, req.body.id], (err) => {
                if (this.changes > 1) {
                    return res.send({
                        status: 1,
                        message: '更新文章分类失败!'
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: '更新文章分类成功!'
                    })
                }
            })
        }
    })
}