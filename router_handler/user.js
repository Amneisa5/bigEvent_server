// 导入jsonwebtoken 用于生成token秘钥
const jwt = require('jsonwebtoken');
//导入 bcryptjs 用于密码加密
const bcrypt = require('bcryptjs')
// 导入sqlite3
const sqlite3 = require('sqlite3').verbose();
// 创建一个数据库对象 如果数据库不存在会创建一个数据库
var db = new sqlite3.Database('ev_user.db', function (err) {
    if (err) {
        throw err;
    }
});
// 全局加密秘钥
const secretKey = 'Amneisa 0_0';
// 注册处理函数
exports.reguser = (req, res) => {
    // 检测表单数据是否合法
    const reguseruser = req.body;
    if (!reguseruser.username || !reguseruser.password) {
        return res.send({
            status: 1,
            message: "用户名或密码不合法！"
        });
    }
    // 检测用户名是否被占用
    db.serialize(function () {
        db.all('select * from user WHERE username=?', reguseruser.username, function (err, row) {
            if (row.length > 0) {
                return res.send({
                    status: 1,
                    message: '当前用户已存在!'
                });
            }
            else {
                // 对密码进行加密处理
                // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
                reguseruser.password = bcrypt.hashSync(reguseruser.password, 10);
                // 插入新用户
                db.run('insert into user(username,password) values(?,?)', [reguseruser.username, reguseruser.password], function (err) {
                    return res.send({
                        status: 0,
                        message: '注册用户成功!'
                    });
                });
            }
        });
    });
};
// 登录处理函数
exports.login = (req, res) => {
    // 接受表单数据
    const loginuser = req.body;
    // 根据用户名查询用户的数据
    db.all('select * from user where username=?', loginuser.username, function (err, row) {
        if (row.length !== 1) {
            return res.send({
                status: 1,
                message: '登录失败!'
            });
        }
        else {
            // 拿着用户输入的密码,和数据库中存储的密码进行对比
            const compareResult = bcrypt.compareSync(loginuser.password, row[0].password);
            // 如果对比的结果等于 false, 则证明用户输入的密码错误
            if (!compareResult) {
                return res.send({
                    status:1,
                    message:'密码错误!'
                })
            }
            else {
                // 提出用户部分信息
                const user = {...row[0],password:'',user_pic:''};
                // 生成token字符串
                const tokenStr = jwt.sign(user,secretKey,{expiresIn:'10h'}) // expiresIn 有效时间
                return res.send({
                    status:0,
                    message:'登录成功!',
                    token:'Bearer ' + tokenStr
                })
            }
        }
    });
};
