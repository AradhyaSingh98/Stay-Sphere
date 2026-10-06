const Property = require('../models/Property')
const cloudinary = require('../config/cloudinary')

// Upload property images to Cloudinary
const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'Please select at least one image',
      })
    }

    const uploadedImages = req.files.map(
      (file) => file.path || file.secure_url
    )

    res.status(200).json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
    })
  } catch (error) {
    console.error(
      'Cloudinary upload error:',
      error.message
    )

    res.status(500).json({
      message: 'Image upload failed',
    })
  }
}
// Get properties with search, filters and sorting
const getProperties = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      guests,
      amenities,
      sort,
    } = req.query

    const filter = {}

    if (location) {
      filter.location = {
        $regex: location,
        $options: 'i',
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {}

      if (minPrice) {
        filter.price.$gte = Number(minPrice)
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice)
      }
    }

    if (guests) {
      filter.guests = {
        $gte: Number(guests),
      }
    }

    if (amenities) {
      const amenityList = amenities
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')

      if (amenityList.length > 0) {
        filter.amenities = {
          $all: amenityList,
        }
      }
    }

    let sortOption = { createdAt: -1 }

    if (sort === 'priceLow') {
      sortOption = { price: 1 }
    } else if (sort === 'priceHigh') {
      sortOption = { price: -1 }
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort(sortOption)

    res.status(200).json(properties)
  } catch (error) {
    console.error('Get properties error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

// Create a property
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      guests,
      images,
      amenities,
    } = req.body

    if (
      !title ||
      !description ||
      !location ||
      !price ||
      !guests ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        message: 'Please provide all required fields and at least one image',
      })
    }

    const property = await Property.create({
      title,
      description,
      location,
      price,
      guests,
      images,
      amenities: amenities || [],
      owner: req.user,
    })

    res.status(201).json({
      message: 'Property created successfully',
      property,
    })
  } catch (error) {
    console.error('Create property error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

// Get single property
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email')

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      })
    }

    res.status(200).json(property)
  } catch (error) {
    console.error('Get property error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

// Update property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      })
    }

    if (property.owner.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: 'You can only update your own property',
      })
    }

    const {
      title,
      description,
      location,
      price,
      guests,
      images,
      amenities,
    } = req.body

    property.title = title ?? property.title
    property.description = description ?? property.description
    property.location = location ?? property.location
    property.price = price ?? property.price
    property.guests = guests ?? property.guests
    property.images = images ?? property.images
    property.amenities = amenities ?? property.amenities

    await property.save()

    res.status(200).json({
      message: 'Property updated successfully',
      property,
    })
  } catch (error) {
    console.error('Update property error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      })
    }

    if (property.owner.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own property',
      })
    }

    await property.deleteOne()

    res.status(200).json({
      message: 'Property deleted successfully',
    })
  } catch (error) {
    console.error('Delete property error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

// Get logged-in user's properties
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user,
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(properties)
  } catch (error) {
    console.error('Get my properties error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

module.exports = {
  getProperties,
  getMyProperties,
  uploadPropertyImages,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
}