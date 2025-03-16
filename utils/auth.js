//next:auth.jsでの処理が完了したら、次の処理を実行する
const jwt = require("jsonwebtoken");
const secretKey = "mern";
const auth = async (req, res, next) => {
    if (req.method === "GET") {
        return next();
    }
    const token = await req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(400).json({ meaasge: "token not found" })
    }
    try {
        const decode = jwt.verify(token, secretKey);
        req.body.email = decode.email;
        return next();
    } catch (error) {
        return res.status(400).json({ message: "token is npt vaild" })
    }
}

module.exports = auth;