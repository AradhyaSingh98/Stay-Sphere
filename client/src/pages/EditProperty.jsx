import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    guests: '',
    amenities: '',
  })

  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(
          '/properties/' + id
        )

        const property = response.data

        setFormData({
          title: property.title || '',
          description: property.description || '',
          location: property.location || '',
          price: property.price || '',
          guests: property.guests || '',
          amenities: property.amenities
            ? property.amenities.join(', ')
            : '',
        })

        setExistingImages(
          property.images?.length > 0
            ? property.images
            : property.image
              ? [property.image]
              : []
        )
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Failed to load property'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNewImages = (e) => {
    const selectedImages = Array.from(e.target.files)

    if (
      existingImages.length + selectedImages.length >
      6
    ) {
      setError('You can have maximum 6 images')
      return
    }

    setError('')
    setNewImages(selectedImages)
  }

  const removeExistingImage = (index) => {
    setExistingImages(
      existingImages.filter(
        (_, imageIndex) => imageIndex !== index
      )
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)
    setError('')

    try {
      let finalImages = [...existingImages]

      // Upload newly selected images
      if (newImages.length > 0) {
        const imageData = new FormData()

        newImages.forEach((image) => {
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

        finalImages = [
          ...finalImages,
          ...uploadResponse.data.images,
        ]
      }

      if (finalImages.length === 0) {
        setError(
          'Please keep at least one property image'
        )
        setSaving(false)
        return
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number(formData.price),
        guests: Number(formData.guests),
        images: finalImages,
        amenities: formData.amenities
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== ''),
      }

      await api.put(
        '/properties/' + id,
        propertyData
      )

      navigate('/properties/' + id)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Failed to update property'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-purple-50 px-6 py-16 text-center">
        <p className="font-bold text-purple-700">
          Loading property...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-purple-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h1 className="text-center text-4xl font-extrabold text-purple-700">
            Edit Property
          </h1>

          <p className="mt-2 text-center font-medium text-gray-500">
            Update your property details
          </p>

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
                required
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500"
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
                rows="4"
                required
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500"
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
                required
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500"
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
                  min="1"
                  required
                  className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500"
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
                  min="1"
                  required
                  className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

            </div>

            {/* Existing Images */}
            <div>
              <label className="mb-3 block font-bold text-gray-700">
                Current Property Images
              </label>

              {existingImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {existingImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-2xl border border-purple-100"
                    >
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-gray-50 p-4 text-center font-medium text-gray-500">
                  No images selected
                </p>
              )}
            </div>

            {/* Add New Images */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Add New Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImages}
                className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                Maximum 6 images total.
              </p>

              {newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {newImages.map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-purple-100"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New image ${index + 1}`}
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
                className="w-full rounded-2xl border border-purple-100 px-4 py-3 outline-none focus:border-purple-500"
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

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate('/properties/' + id)
                }
                className="w-1/2 rounded-full border border-purple-200 px-6 py-4 font-extrabold text-purple-700 hover:bg-purple-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-1/2 rounded-full bg-purple-700 px-6 py-4 font-extrabold text-white hover:bg-purple-800 disabled:opacity-50"
              >
                {saving
                  ? 'Uploading & Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </form>

        </div>
      </div>
    </main>
  )
}

export default EditProperty

