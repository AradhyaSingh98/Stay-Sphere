require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const bookingRoutes = require('./routes/bookingRoutes')



const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/bookings', bookingRoutes)
// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'StaySphere API is running 🚀',
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully ✅')

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`StaySphere server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed ❌')
    console.error(error.message)
  })