require('dotenv').config()

const axios = require('axios')
const mongoose = require('mongoose')
const cloudinary = require('./config/cloudinary')

const User = require('./models/User')
const Property = require('./models/Property')

const MONGO_URI = process.env.MONGO_URI
const SEED_OWNER_EMAIL = process.env.SEED_OWNER_EMAIL

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing in .env')
  process.exit(1)
}

// =====================================================
// 12 DESTINATIONS
// 5 IMAGES EACH = 60 IMAGES
// =====================================================

const destinations = [
  {
    title: 'Beachside Paradise in Goa',
    search: 'Goa beach India',
    location: 'Goa',
    description:
      'A beautiful coastal stay surrounded by beaches, palm trees and amazing views.',
    price: 4500,
    guests: 4,
    amenities: ['WiFi', 'AC', 'Pool', 'Kitchen', 'Parking'],
  },

  {
    title: 'Mountain Escape in Manali',
    search: 'Manali Himachal Pradesh India',
    location: 'Manali',
    description:
      'A peaceful mountain stay with beautiful Himalayan views and fresh mountain air.',
    price: 3200,
    guests: 4,
    amenities: ['WiFi', 'Heating', 'Kitchen', 'Parking', 'Balcony'],
  },

  {
    title: 'Royal Heritage Stay in Jaipur',
    search: 'Jaipur Rajasthan India',
    location: 'Jaipur',
    description:
      'Experience the royal architecture and colourful streets of the Pink City.',
    price: 3500,
    guests: 5,
    amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Parking'],
  },

  {
    title: 'Lake View Retreat in Udaipur',
    search: 'Udaipur Rajasthan India lake',
    location: 'Udaipur',
    description:
      'A peaceful stay inspired by the beautiful lakes and palaces of Udaipur.',
    price: 4200,
    guests: 4,
    amenities: ['WiFi', 'AC', 'Balcony', 'Kitchen', 'Parking'],
  },

  {
    title: 'Snowy Mountain Stay in Kashmir',
    search: 'Kashmir India mountains',
    location: 'Kashmir',
    description:
      'Enjoy breathtaking Himalayan scenery and the natural beauty of Kashmir.',
    price: 3800,
    guests: 4,
    amenities: ['WiFi', 'Heating', 'Kitchen', 'Balcony', 'Parking'],
  },

  {
    title: 'Kerala Backwater Retreat',
    search: 'Kerala India backwaters',
    location: 'Kerala',
    description:
      'Relax among tropical greenery, peaceful backwaters and beautiful Kerala landscapes.',
    price: 4000,
    guests: 4,
    amenities: ['WiFi', 'AC', 'Garden', 'Kitchen', 'Parking'],
  },

  {
    title: 'Desert Heritage Home in Jaisalmer',
    search: 'Jaisalmer Rajasthan India desert',
    location: 'Jaisalmer',
    description:
      'Discover the golden city, desert landscapes and historic architecture of Jaisalmer.',
    price: 3000,
    guests: 4,
    amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Parking'],
  },

  {
    title: 'Riverside Retreat in Rishikesh',
    search: 'Rishikesh India Ganges river',
    location: 'Rishikesh',
    description:
      'A peaceful riverside escape surrounded by mountains and the Ganges.',
    price: 2800,
    guests: 3,
    amenities: ['WiFi', 'Garden', 'Balcony', 'Kitchen', 'Parking'],
  },

  {
    title: 'Tropical Escape in Andaman',
    search: 'Andaman India beach islands',
    location: 'Andaman',
    description:
      'Enjoy crystal-clear waters, tropical beaches and beautiful island scenery.',
    price: 5200,
    guests: 4,
    amenities: ['WiFi', 'AC', 'Pool', 'Kitchen', 'Beach Access'],
  },

  {
    title: 'Hill View Cottage in Darjeeling',
    search: 'Darjeeling India Himalaya',
    location: 'Darjeeling',
    description:
      'A cozy mountain retreat surrounded by tea gardens and Himalayan views.',
    price: 3000,
    guests: 4,
    amenities: ['WiFi', 'Heating', 'Kitchen', 'Balcony', 'Parking'],
  },

  {
    title: 'Sea View Apartment in Mumbai',
    search: 'Mumbai India Marine Drive',
    location: 'Mumbai',
    description:
      'Stay close to Mumbai landmarks, the Arabian Sea and the vibrant city centre.',
    price: 4800,
    guests: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Workspace'],
  },

  {
    title: 'Heritage Stay Near Taj Mahal',
    search: 'Agra India Taj Mahal',
    location: 'Agra',
    description:
      'A comfortable stay near one of India’s most famous landmarks, the Taj Mahal.',
    price: 2800,
    guests: 4,
    amenities: ['WiFi', 'AC', 'Kitchen', 'TV', 'Parking'],
  },
]

// =====================================================
// GET IMAGES FROM WIKIMEDIA COMMONS
// =====================================================

async function getWikimediaImages(searchTerm, count = 5) {
  console.log(`\n🔎 Searching Wikimedia: ${searchTerm}`)

  try {
    const response = await axios.get(
      'https://commons.wikimedia.org/w/api.php',
      {
        params: {
          action: 'query',
          generator: 'search',
          gsrsearch: searchTerm,
          gsrnamespace: 6,
          gsrlimit: 20,
          prop: 'imageinfo',
          iiprop: 'url|extmetadata',
          iiurlwidth: 1400,
          format: 'json',
          origin: '*',
        },
        headers: {
          'User-Agent': 'StaySphere/1.0',
        },
      }
    )

    const pages = response.data?.query?.pages

    if (!pages) {
      console.log(`⚠️ No images found for ${searchTerm}`)
      return []
    }

    const results = Object.values(pages)

    const images = []

    for (const page of results) {
      if (images.length >= count) {
        break
      }

      const imageInfo = page.imageinfo?.[0]

      if (!imageInfo || !imageInfo.url) {
        continue
      }

      const imageUrl = imageInfo.url

      const isValidImage =
        /\.(jpg|jpeg|png|webp)$/i.test(imageUrl)

      if (!isValidImage) {
        continue
      }

      images.push({
        url: imageUrl,
        title: page.title,
      })
    }

    console.log(`✅ Found ${images.length} images`)

    return images
  } catch (error) {
    console.error(
      `❌ Wikimedia search failed: ${error.message}`
    )

    return []
  }
}

// =====================================================
// UPLOAD IMAGE TO CLOUDINARY
// =====================================================

async function uploadToCloudinary(image, destination) {
  try {
    console.log(`   ☁️ Uploading: ${image.title}`)

    const result = await cloudinary.uploader.upload(
      image.url,
      {
        folder: `staysphere/properties/${destination}`,
        resource_type: 'image',
      }
    )

    console.log('   ✅ Uploaded successfully')

    return result.secure_url
  } catch (error) {
    console.error(
      `   ❌ Cloudinary upload failed: ${error.message}`
    )

    return null
  }
}

// =====================================================
// MAIN SEED FUNCTION
// =====================================================

async function seedProperties() {
  try {
    console.log('\n========================================')
    console.log('🏠 STAYSPHERE IMAGE SEEDING')
    console.log('========================================')
    console.log('📍 Destinations: 12')
    console.log('🖼️ Images per destination: 5')
    console.log('🖼️ Total target images: 60')
    console.log('========================================\n')

    // Connect MongoDB
    await mongoose.connect(MONGO_URI)

    console.log('✅ MongoDB connected successfully\n')

    // Find owner
    let owner = null

    if (SEED_OWNER_EMAIL) {
      owner = await User.findOne({
        email: SEED_OWNER_EMAIL,
      })
    }

    if (!owner) {
      owner = await User.findOne()
    }

    if (!owner) {
      console.error('❌ No user found.')
      console.error('Please register a user first.')
      process.exit(1)
    }

    console.log(`👤 Owner: ${owner.email}\n`)

    let totalImagesUploaded = 0
    let totalPropertiesCreated = 0

    // Process every destination
    for (let i = 0; i < destinations.length; i++) {
      const destination = destinations[i]

      console.log('\n----------------------------------------')
      console.log(
        `📍 ${i + 1}/${destinations.length}: ${destination.location}`
      )
      console.log('----------------------------------------')

      // Search Wikimedia
      const wikimediaImages =
        await getWikimediaImages(
          destination.search,
          5
        )

      if (wikimediaImages.length === 0) {
        console.log(
          `⚠️ Skipping ${destination.location}`
        )

        continue
      }

      const uploadedImages = []

      // Upload images
      for (let j = 0; j < wikimediaImages.length; j++) {
        const image = wikimediaImages[j]

        const destinationFolder =
          destination.location
            .toLowerCase()
            .replace(/\s+/g, '-')

        const uploadedUrl =
          await uploadToCloudinary(
            image,
            destinationFolder
          )

        if (uploadedUrl) {
          uploadedImages.push(uploadedUrl)
          totalImagesUploaded++
        }
      }

      // Create property
      if (uploadedImages.length > 0) {
        const property =
          await Property.create({
            title: destination.title,
            description: destination.description,
            location: destination.location,
            price: destination.price,
            guests: destination.guests,
            amenities: destination.amenities,
            images: uploadedImages,
            owner: owner._id,
          })

        totalPropertiesCreated++

        console.log('\n   🏠 Property created')
        console.log(`   🆔 ${property._id}`)
        console.log(
          `   🖼️ Images saved: ${uploadedImages.length}`
        )
      }

      // Small delay
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
    }

    // Final result
    console.log('\n========================================')
    console.log('🎉 SEEDING COMPLETED')
    console.log('========================================')
    console.log(
      `🏠 Properties created: ${totalPropertiesCreated}`
    )
    console.log(
      `🖼️ Images uploaded: ${totalImagesUploaded}`
    )
    console.log('☁️ Cloudinary upload completed')
    console.log('========================================\n')

    await mongoose.connection.close()

    console.log('✅ MongoDB connection closed')
    console.log('🚀 StaySphere seeding finished!\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ SEEDING FAILED')
    console.error(error)

    try {
      await mongoose.connection.close()
    } catch (closeError) {
      console.error('Could not close MongoDB connection')
    }

    process.exit(1)
  }
}

// Start
seedProperties()

