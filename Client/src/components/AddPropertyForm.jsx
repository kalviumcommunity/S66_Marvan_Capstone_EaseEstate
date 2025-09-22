import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, IndianRupee, Image, FileText } from 'lucide-react';
import { propertyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';

const AddPropertyForm = ({ onPropertyAdded }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    country: 'India',
    image: '',
    bedrooms: '',
    bathrooms: '',
    area: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.image.trim()) {
      errors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      errors.image = 'Please enter a valid image URL';
    }

    if (formData.bedrooms && (formData.bedrooms < 0 || formData.bedrooms > 20)) {
      errors.bedrooms = 'Bedrooms must be between 0 and 20';
    }

    if (formData.bathrooms && (formData.bathrooms < 0 || formData.bathrooms > 10)) {
      errors.bathrooms = 'Bathrooms must be between 0 and 10';
    }

    if (formData.area && (formData.area < 0 || formData.area > 10000)) {
      errors.area = 'Area must be between 0 and 10000 sq ft';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('You must be logged in to add a property');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseInt(formData.area) : 0
      };

      await propertyAPI.addProperty(propertyData, user._id);
      setSuccess(true);

      // Call the refresh callback if provided
      if (onPropertyAdded) {
        onPropertyAdded();
      }

      // Redirect to properties list after 2 seconds
      setTimeout(() => {
        navigate('/properties');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add property. Please try again.');
      console.error('Error adding property:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Added Successfully!</h2>
          <p className="text-gray-600 mb-6">Your property has been added and is now visible to other users.</p>
          <Button onClick={() => navigate('/properties')} variant="primary">
            View All Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/properties')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
                <p className="text-gray-600">List your property for others to discover</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Property Title"
                    name="title"
                    placeholder="e.g., Modern Apartment in City Center"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={formErrors.title}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your property, including key features, amenities, and what makes it special..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    } hover:border-gray-400 resize-none`}
                    required
                  />
                  {formErrors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    placeholder="e.g., 123 Main Street, Sector 15"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={formErrors.address}
                    required
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  placeholder="e.g., Mumbai"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={formErrors.city}
                  required
                />

                <Input
                  label="Country"
                  name="country"
                  placeholder="e.g., India"
                  value={formData.country}
                  onChange={handleInputChange}
                  error={formErrors.country}
                  required
                />
              </div>
            </div>

            {/* Price and Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                Price & Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Price (₹)"
                  name="price"
                  type="number"
                  placeholder="2500000"
                  value={formData.price}
                  onChange={handleInputChange}
                  error={formErrors.price}
                  required
                />

                <Input
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  error={formErrors.bedrooms}
                />

                <Input
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  error={formErrors.bathrooms}
                />

                <Input
                  label="Area (sq ft)"
                  name="area"
                  type="number"
                  placeholder="1200"
                  value={formData.area}
                  onChange={handleInputChange}
                  error={formErrors.area}
                />
              </div>
            </div>

            {/* Image */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Property Image
              </h2>
              <Input
                label="Image URL"
                name="image"
                type="url"
                placeholder="https://example.com/property-image.jpg"
                value={formData.image}
                onChange={handleInputChange}
                error={formErrors.image}
                required
              />
              <p className="mt-2 text-sm text-gray-600">
                Provide a URL to an image of your property. Make sure the URL is publicly accessible.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/properties')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyForm;