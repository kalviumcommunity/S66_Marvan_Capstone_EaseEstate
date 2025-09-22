import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Home,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import Button from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserProperties = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll fetch all properties and filter by owner
      // In a real app, you'd have a dedicated endpoint for user's properties
      const response = await propertyAPI.getAllProperties();
      // Filter properties where the current user is the owner
      const userProperties = response.data.filter(property =>
        property.owner === user?.id
      );
      setProperties(userProperties);
    } catch (err) {
      setError('Failed to load your properties. Please try again.');
      console.error('Error fetching user properties:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserProperties();
  }, [fetchUserProperties]);

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.deleteProperty(propertyId);
        setProperties(properties.filter(p => p._id !== propertyId));
      } catch (err) {
        setError('Failed to delete property. Please try again.');
        console.error('Error deleting property:', err);
      }
    }
  };

  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  const averagePrice = properties.length > 0 ? totalValue / properties.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your properties and track your real estate portfolio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(averagePrice)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link to="/add-property">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Property
            </Button>
          </Link>
          <Link to="/properties">
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="w-4 h-4 mr-2" />
              Browse All Properties
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start building your real estate portfolio by adding your first property
                </p>
                <Link to="/add-property">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <img
                            src={property.image || '/placeholder-property.jpg'}
                            alt={property.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {property.address}, {property.city}, {property.country}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                              <span>{property.area.toLocaleString()} sq ft</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(property.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Listed {formatDate(property.createdAt || new Date())}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link to={`/property/${property._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/edit-property/${property._id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProperty(property._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;