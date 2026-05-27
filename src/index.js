import dotenv from "dotenv"
dotenv.config({
    // path:"../.env"

})


import {app} from "./app.js"
import connectDB from "./db/index.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server is running on port :${process.env.port}`)
    })
})
.catch((err)=>{
    console.log("MongoDb connecction failed !!!", err)

})
console.log(process.env.MONGODB_URL)
