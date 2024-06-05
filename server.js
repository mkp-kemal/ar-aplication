import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import fileUpload from 'express-fileupload'

//config .env
dotenv.config()

//konek database
connectDB()

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.raw({ type: 'image/*', limit: '10mb' }));
app.use(fileUpload());

// Routes
app.use('/v1/api/', userRoutes)

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`)
})