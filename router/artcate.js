// 导入 express
const express = require('express');
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章分类的验证模块 导入删除分类的验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/user');
// 创建路由对象
const router = express.Router();

// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate');
// 获取文章分类的列表数据
router.get('/cates', artcate_handler.getArticleCates);
// 增加文章分类
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates);
// 根据id删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById);
// 根据id获取文章分类
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById);
// 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)
// 导出router
module.exports = router;