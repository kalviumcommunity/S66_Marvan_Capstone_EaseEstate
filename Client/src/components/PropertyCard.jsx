import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Trash2, Star } from 'lucide-react';
import { formatPrice } from '../utils';
import { Card, CardContent } from './ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI } from '../services/api';
import ConfirmationDialog from './ui/ConfirmationDialog';

const PropertyCard = ({
  property,
  onFavoriteToggle,
  isFavorite = false,
  onDelete,
  showRemoveFromFavorites = false,
  onRemoveFromFavorites,
  onWishlistToggle,
  isWishlisted = false,
  showRemoveFromWishlist = false,
  onRemoveFromWishlist
}) => {
  const { user } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false);
  const [showRemoveWishlistDialog, setShowRemoveWishlistDialog] = useState(false);

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

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        // Remove from favorites
        await propertyAPI.removeFromFavorites(user._id, _id);
        if (onFavoriteToggle) {
          onFavoriteToggle(_id, false);
        }
      } else {
        // Add to favorites
        await propertyAPI.addToFavorites(user._id, _id);
        if (onFavoriteToggle) {
          onFavoriteToggle(_id, true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    try {
      setDeleteLoading(true);
      await propertyAPI.deleteProperty(_id);
      if (onDelete) {
        onDelete(_id);
      }
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (!user) return;

    try {
      setFavoriteLoading(true);
      await propertyAPI.removeFromFavorites(user._id, _id);
      if (onRemoveFromFavorites) {
        onRemoveFromFavorites(_id);
      }
      setShowRemoveFavoriteDialog(false);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        // Remove from wishlist
        await propertyAPI.removeFromWishlist(user._id, _id);
        if (onWishlistToggle) {
          onWishlistToggle(_id, false);
        }
      } else {
        // Add to wishlist
        await propertyAPI.addToWishlist(user._id, _id);
        if (onWishlistToggle) {
          onWishlistToggle(_id, true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async () => {
    if (!user) return;

    try {
      setWishlistLoading(true);
      await propertyAPI.removeFromWishlist(user._id, _id);
      if (onRemoveFromWishlist) {
        onRemoveFromWishlist(_id);
      }
      setShowRemoveWishlistDialog(false);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
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
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-5 h-5 ${isWishlisted ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
            />
          </button>
          {isOwner && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteLoading}
              className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Property"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          {showRemoveFromFavorites && (
            <button
              onClick={() => setShowRemoveFavoriteDialog(true)}
              disabled={favoriteLoading}
              className="p-2 bg-orange-600 text-white rounded-full shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove from Favorites"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          {showRemoveFromWishlist && (
            <button
              onClick={() => setShowRemoveWishlistDialog(true)}
              disabled={wishlistLoading}
              className="p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove from Wishlist"
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteLoading}
      />

      {/* Remove from Favorites Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRemoveFavoriteDialog}
        onClose={() => setShowRemoveFavoriteDialog(false)}
        onConfirm={handleRemoveFromFavorites}
        title="Remove from Favorites"
        message={`Are you sure you want to remove "${title}" from your favorites?`}
        confirmText="Remove"
        variant="warning"
        isLoading={favoriteLoading}
      />

      {/* Remove from Wishlist Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRemoveWishlistDialog}
        onClose={() => setShowRemoveWishlistDialog(false)}
        onConfirm={handleRemoveFromWishlist}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove "${title}" from your wishlist?`}
        confirmText="Remove"
        variant="warning"
        isLoading={wishlistLoading}
      />
    </Card>
  );
};

export default PropertyCard;