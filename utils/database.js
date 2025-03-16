const mongoose = require("mongoose");
//async await
const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://lizifeihello:lizifeino.1@cluster0.oqsmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        )
        console.log("Database connected")
    }catch(error){
        console.log(error.message)
    }
}
module.exports = connectDB;