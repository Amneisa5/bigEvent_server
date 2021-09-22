const e = require('express');
// 在头部区域导入 bcryptjs 后，
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs')
// 导入joi
const expressJoi = require('joi');
// 导入需要的验证规则对象
const { update_userinfo_schema } = require('../schema/user')
// 导入数据库操作模块
const sqlite3 = require('sqlite3').verbose();
// 创建一个数据库对象 如果数据库不存在会创建一个数据库
var db = new sqlite3.Database('ev_user.db', function (err) {
    if (err) {
        throw err;
    }
});
// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.all('select username,nickname,email,user_pic from user where username=?', req.user.username, (err, row) => {
        if (row.length !== 1) {
            return res.send({
                status: 1,
                message: '获取用户基本信息失败!'
            })
        }
        else {
            return res.send({
                status: 0,
                message: '获取用户基本信息成功!',
                data: row[0]
            });
        }
    });
}
// 更新用户基本信息
exports.updateUserInfo = (req, res) => {
    db.run('update user set nickname=?,email=? where username=?', [req.body.nickname, req.body.email, req.user.username], (err) => {
        if (err) {
            return res.send({
                status: 1,
                message: '更新用户信息失败！'
            })
        }
        else {
            return res.send({
                status: 0,
                message: '更新用户信息成功！'
            })
        }
    })
}
// 更新用户密码
exports.updatePassword = (req, res) => {
    // 验证表单数据
    db.all('select * from user where username=?', req.user.username, (err, row) => {
        if (row.length !== 1) {
            return res.send({
                status: 1,
                message: '当前用户不存在'
            })
        }
        else {
            // 判断提交的旧密码是否正确
            const compareResult = bcrypt.compareSync(req.body.oldPwd, row[0].password)
            if (!compareResult) {
                return res.send({
                    status: 1,
                    message: '密码错误'
                })
            }
            else {
                // 对新密码进行 bcrypt 加密处理
                const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
                db.run('update user set password=? where username=?', [newPwd, req.user.username], (err) => {
                    if (err) {
                        return res.send({
                            status: 1,
                            message: '更新密码失败!'
                        })
                    }
                    else {
                        return res.send({
                            status: 0,
                            message: '更新密码成功!'
                        })
                    }
                })
            }
        }
    })
}
// 更新用户头像
exports.updateAvatar = (req,res)=>{
    db.run('update user set avatar=? where username=?',[req.body.avatar,req.user.username],(err)=>{
        if(err){
            return res.send({
                status:1,
                msg:'更新头像失败!'
            })
        }
        else{
            return res.send({
                status:0,
                msg:'更新头像成功!'
            })
        }
    })
}