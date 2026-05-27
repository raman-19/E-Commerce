import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credential:true
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// routes import
import userRoutes from "./routes/user.routes.js"
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
app.use(cookieParser())



// routes

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/carts", cartRoutes)
app.use("/api/v1/orders", orderRoutes)
export{app}