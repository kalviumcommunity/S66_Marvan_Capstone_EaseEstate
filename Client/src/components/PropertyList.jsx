import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { propertyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from './PropertyCard';
import Button from './ui/Button';
import Input from './ui/Input';

const PropertyList = forwardRef((props, ref) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);

  useEffect(() => {
    fetchProperties();
    fetchUserFavorites();
    fetchUserWishlist();
  }, [user?.id]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties();
      setProperties(response.data);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    if (!user?.id) return;

    try {
      const response = await propertyAPI.getUserFavorites(user.id);
      setUserFavorites(response.data.map(fav => fav._id));
    } catch (err) {
      console.error('Error fetching user favorites:', err);
      setUserFavorites([]);
    }
  };

  const fetchUserWishlist = async () => {
    if (!user?.id) return;

    try {
      const response = await propertyAPI.getUserWishlist(user.id);
      setUserWishlist(response.data.map(item => item._id));
    } catch (err) {
      console.error('Error fetching user wishlist:', err);
      setUserWishlist([]);
    }
  };

  // Expose refresh function to parent components
  useImperativeHandle(ref, () => ({
    refreshProperties: fetchProperties
  }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handlePropertyDelete = (deletedPropertyId) => {
    setProperties(prev => prev.filter(property => property._id !== deletedPropertyId));
  };

  const handleFavoriteToggle = async (propertyId, isFavorite) => {
    if (!user?.id) return;

    try {
      if (isFavorite) {
        // Remove from favorites
        await propertyAPI.removeFromFavorites(user.id, propertyId);
        setUserFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add to favorites
        await propertyAPI.addToFavorites(user.id, propertyId);
        setUserFavorites(prev => [...prev, propertyId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Refresh favorites to ensure consistency
      fetchUserFavorites();
    }
  };

  const handleWishlistToggle = async (propertyId, isWishlisted) => {
    if (!user?.id) return;

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await propertyAPI.removeFromWishlist(user.id, propertyId);
        setUserWishlist(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add to wishlist
        await propertyAPI.addToWishlist(user.id, propertyId);
        setUserWishlist(prev => [...prev, propertyId]);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      // Refresh wishlist to ensure consistency
      fetchUserWishlist();
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchQuery ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = !filters.city ||
      property.city.toLowerCase().includes(filters.city.toLowerCase());

    const matchesPrice = (!filters.minPrice || property.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || property.price <= parseInt(filters.maxPrice));

    const matchesBedrooms = !filters.bedrooms ||
      property.bedrooms >= parseInt(filters.bedrooms);

    return matchesSearch && matchesCity && matchesPrice && matchesBedrooms;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing properties in your desired location
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="px-8 py-4">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Properties
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="City"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
              />
              <Input
                label="Min Price"
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <Input
                label="Max Price"
                type="number"
                placeholder="10000000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
              <Input
                label="Min Bedrooms"
                type="number"
                placeholder="0"
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Properties'}
          </h2>
          <p className="text-gray-600">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onDelete={handlePropertyDelete}
                isFavorite={userFavorites.includes(property._id)}
                onFavoriteToggle={handleFavoriteToggle}
                isWishlisted={userWishlist.includes(property._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

PropertyList.displayName = 'PropertyList';

export default PropertyList;