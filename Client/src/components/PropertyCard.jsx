import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils';
import { Card, CardContent } from './ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI } from '../services/api';

const PropertyCard = ({ property, onFavoriteToggle, isFavorite = false, onDelete }) => {
  const { user } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    _id,
    title,
    price,
    address,
    city,
    country,
    image,
    description,
    bedrooms = 0,
    bathrooms = 0,
    area = 0,
    owner
  } = property;

  const isOwner = user && owner === user._id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOwner) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await propertyAPI.deleteProperty(_id);
      if (onDelete) {
        onDelete(_id);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <Link to={`/property/${_id}`}>
          <img
            src={image || '/placeholder-property.jpg'}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onFavoriteToggle && onFavoriteToggle(_id)}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Property"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            For Sale
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <Link to={`/property/${_id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm line-clamp-1">
              {address}, {city}, {country}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(price)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{area.toLocaleString()} sqft</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex gap-2">
          <Link to={`/property/${_id}`} className="flex-1">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View Details
            </button>
          </Link>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Contact
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;