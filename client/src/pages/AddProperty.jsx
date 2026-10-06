import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function AddProperty() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    guests: '',
    amenities: '',
  })

  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files)

    if (selectedImages.length > 6) {
      setError('You can select maximum 6 images')
      return
    }

    setError('')
    setImages(selectedImages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (images.length === 0) {
      setError('Please select at least one property image')
      return
    }

    setLoading(true)

    try {
      // Upload images to Cloudinary
      const imageData = new FormData()

      images.forEach((image) => {
        imageData.append('images', image)
      })

      const uploadResponse = await api.post(
        '/properties/upload-images',
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const uploadedImageUrls = uploadResponse.data.images

      // Create property using Cloudinary URLs
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number(formData.price),
        guests: Number(formData.guests),
        images: uploadedImageUrls,
        amenities: formData.amenities
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== ''),
      }

      await api.post('/properties', propertyData)

      navigate('/properties')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Failed to create property'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-purple-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-purple-700">
              Add Your Property
            </h1>

            <p className="mt-2 font-medium text-gray-500">
              List your property on StaySphere
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Title */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Property Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Luxury Apartment"
                required
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="4"
                required
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Gurugram, Haryana"
                required
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Price + Guests */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-bold text-gray-700">
                  Price per Night
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2500"
                  min="1"
                  required
                  className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-gray-700">
                  Maximum Guests
                </label>

                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  placeholder="4"
                  min="1"
                  required
                  className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

            </div>

            {/* Multiple Images */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Property Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                Select up to 6 images. JPG, PNG or WEBP recommended.
              </p>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-purple-100"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Amenities
              </label>

              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="WiFi, AC, Parking, Kitchen"
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <p className="mt-2 text-sm text-gray-500">
                Separate amenities with commas.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-center font-bold text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-purple-700 px-6 py-4 font-extrabold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Uploading & Creating Property...'
                : 'Add Property'}
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}

export default AddProperty