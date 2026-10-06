const express = require('express')

const {
  getProperties,
  getMyProperties,
  uploadPropertyImages,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../Controllers/propertyController')

const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

router.get('/', getProperties)

router.get('/my', protect, getMyProperties)

router.post(
  '/upload-images',
  protect,
  upload.array('images', 6),
  uploadPropertyImages
)

router.get('/:id', getPropertyById)

router.post('/', protect, createProperty)

router.put('/:id', protect, updateProperty)

router.delete('/:id', protect, deleteProperty)

module.exports = router