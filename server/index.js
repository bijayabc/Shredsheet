require('dotenv').config();
const express = require("express")
const cors = require('cors')
const connectDB = require('./config/db')
const apiRoutes = require('./routes/apiRoutes')

const app = express()
PORT = process.env.SERVER_PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Parses incoming form-data
app.use(cors()) // Enable CORS for all origins

app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "Fitness Tracker API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  })
})

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    console.log("Connected to MongoDB Atlas")

    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT} \nhttp://localhost:${PORT}`)
    })
  })