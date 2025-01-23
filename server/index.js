import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./db/db.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT} `)
    })
})
.catch((err)=>{
    console.log("Mongo db connection failed", err);
})

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
// import userRouter from './routes/user.routes.js'

//routes declaration
// app.use("/api", userRouter)
