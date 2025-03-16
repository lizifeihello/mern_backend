const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
//express.urlencoded() 是 Express 中间件之一，主要用于解析 URL-encoded（表单数据） 类型的请求体
app.use(express.urlencoded({ extended: true }));
//express.json() 是 Express 提供的内置中间件，用于解析 application/json 类型的请求体数据
app.use(express.json());
//jwt.sign() 方法用于生成一个 token，第一个参数是 payload(user or email)，第二个参数是 secretOrPrivateKey，第三个参数是 options(有効期間)
//jwt.verify() 方法用于验证 token，第一个参数是 token，第二个参数是 secretOrPrivateKey，第三个参数是 options
//jwt.decode() 方法用于解码 token，第一个参数是 token，第二个参数是 options
const jwt = require("jsonwebtoken");
const connectDB = require("./utils/database");
const auth = require("./utils/auth");
const { itemModel, userModel } = require("./utils/schemaModels");
//create method;  auth is a middleware,async (req, res)が始まる前に、middlewareが実行される
app.post("/item/create", auth, async (req, res) => {
    try {
        await connectDB();
        console.log(req.body);
        await itemModel.create({
            title: req.body.title,
            image: req.body.image,
            price: req.body.price,
            description: req.body.description,
            email: req.body.email
        })
        return res.status(200).json({ message: "item created", data: req.body })
    }
    catch (error) {
        return res.status(400).json({ message: "item not created", error: error.message })
    }
})
//find method
app.get("/", async (req, res) => {
    try {
        await connectDB();
        const allItems = await itemModel.find();
        return res.status(200).json({ message: "All items found", data: allItems })
    } catch (error) {
        return res.status(400).json({ message: "All items not found", error: error.message })
    }
})
//findById method
app.get("/item/:id", auth, async (req, res) => {
    try {
        await connectDB();
        const item = await itemModel.findById(req.params.id);
        return res.status(200).json({ message: "item found", data: item });
    } catch (error) {
        return res.status(400).json({ message: "item not found", error: error.message });
    }

})
//udateOne method
app.put("/item/update/:id", auth, async (req, res) => {
    try {
        await connectDB();
        await itemModel.updateOne(({ _id: req.params.id }, req.body));
        return res.status(200).json({ message: "item updated", data: req.body })
    } catch (error) {
        return res.status(400).json({ message: "item not updated", error: error.message })
    }
})
//deleteOne method
app.delete("/item/delete/:id", auth, async (req, res) => {
    try {
        await connectDB();
        await itemModel.deleteOne({ id: req.params.id });
        return res.status(200).json({ message: "item deleted", data: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "item not deleted", error: error.message })
    }
})
//register
app.post("/user/register", async (req, res) => {
    try {
        await connectDB();
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        return res.status(200).json({ message: "user created", data: res.body })
    } catch (error) {
        return res.status(400).json({ message: "user not created", error: error.message })
    }
})
//login
const secretKey = "mern";
app.post("/user/login",  async (req, res) => {
    try {
        await connectDB();
        const saveUserData = await userModel.findOne({ email: req.body.email });
        if (saveUserData) {
            if (saveUserData.password === req.body.password) {
                const token = jwt.sign({ email: saveUserData.email }, secretKey, { expiresIn: "1h" });
                return res.status(200).json({ message: "login success", token: token })
            } else {
                return res.status(200).json({ message: "wrong password" })
            }
        } else {
            return res.status(200).json({ message: "user not found" })
        }
    } catch (error) {
        return res.status(400).json({ message: "login failed", error: error.message })
    }
})
//このサーバが起動するポートを3000指定
//process.env.PORTは、環境変数PORTが設定されている場合はその値を使い、設定されていない場合は3001を使う
const port = process.env.PORT ||3001;
app.listen(port, () => {
    console.log("listening localhost port 3000")
})