const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema 定义了集合中文档的字段类型、默认值、数据验证等
const itemSchema = new schema(
    {
        title: String,
        image: String,
        price: String,
        description: String,
        email: String
    }
);
const userSchema = new schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
)
//Model 是基于 Schema 创建的，它提供了创建、查询、更新和删除 (CRUD) 操作的方法
const itemModel = mongoose.model("item", itemSchema);
const userModel = mongoose.model("user", userSchema);

module.exports = { itemModel, userModel };
