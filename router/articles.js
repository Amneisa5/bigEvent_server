// 导入 express
const express = require('express');
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章数据验证模块
const { add_article_schema } = require('../schema/user');
// 导入处理路径的核心模块
const path = require('path');
// 创建路由对象
const router = express.Router();
// 导入处理函数模块
const article_handle = require('../router_handler/articles');
// 发表文章接口
router.post('/add', expressJoi(add_article_schema), article_handle.addArticle);
// 获取文章列表接口
router.get('/list',article_handle.getArticle)
// 导出router
module.exports = router;