import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  Home,
  Car,
  Wifi,
  Shield
} from 'lucide-react';
import { propertyAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import Button from './ui/Button';
import { Card, CardContent } from './ui/Card';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getPropertyById(id);
      setProperty(response.data);
    } catch (err) {
      setError('Failed to load property details. Please try again.');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleBuyNow = () => {
    // TODO: Implement Razorpay integration
    alert('Payment integration coming soon!');
  };

  const handleContactOwner = () => {
    setShowContactForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <Home className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/properties')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const {
    title,
    price,
    address,
    city,
    country,
    image,
    description,
    bedrooms = 0,
    bathrooms = 0,
    area = 0
  } = property;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/properties')}
            className="mb-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={image || '/placeholder-property.jpg'}
                  alt={title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                  <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
                    For Sale
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{address}, {city}, {country}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{bedrooms} Bedroom{bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{bathrooms} Bathroom{bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-5 h-5 mr-2" />
                    <span>{area.toLocaleString()} sq ft</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Car className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Wifi className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Internet</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Security</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact & Buy Section */}
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(price)}
                  </div>
                  <p className="text-gray-600">Ready to make this yours?</p>
                </div>

                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleBuyNow}
                    className="w-full"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleContactOwner}
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Owner
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Listed {formatDate(property.createdAt || new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            {showContactForm && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="I'm interested in this property..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        Send Message
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;