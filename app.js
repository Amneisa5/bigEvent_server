// 导入express
const express = require('express');
// 导入joi
const joi = require('joi');
// 解析 token 的中间件
const expressJWT = require('express-jwt');
// 创建服务器实例对象
const app = express();
// 配置跨域问题
// 导入 cors 中间件
const cors = require('cors');
// 将 cors 注册为全局中间件
app.use(cors())
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extend: false }))
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: 'Amneisa 0_0', algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))
// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.send({
        status: 1,
        msg: err
    })
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.send({
        status:1,
        msg:'身份认证失败！'
    })
    // 未知错误
    res.send({
        status: 1,
        msg: err
    });
});

// 导入并使用登录注册路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/articles')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)
// 启动服务器
app.listen(8080, '127.0.0.1', function () {
    console.log('api server running at http://127.0.0.1:8080');
})