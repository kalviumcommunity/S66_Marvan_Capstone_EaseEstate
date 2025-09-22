// Mock API for demonstration when backend is not available
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  }
];

const mockProperties = [
  {
    _id: '1',
    title: 'Modern Apartment in City Center',
    description: 'Beautiful 2-bedroom apartment with stunning city views. Features modern amenities and is located in the heart of the city.',
    price: 2500000,
    address: '123 Main Street',
    city: 'Mumbai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    owner: '1',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Luxury Villa with Pool',
    description: 'Spacious 4-bedroom villa with private swimming pool and garden. Perfect for families looking for luxury living.',
    price: 8500000,
    address: '456 Luxury Lane',
    city: 'Delhi',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    owner: '1',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Cozy Studio Apartment',
    description: 'Perfect studio apartment for young professionals. Compact yet comfortable with all modern amenities.',
    price: 1200000,
    address: '789 Studio Street',
    city: 'Bangalore',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    owner: '1',
    createdAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthAPI = {
  register: async (userData) => {
    await delay(1000);
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    const newUser = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email
    };
    mockUsers.push(newUser);
    return {
      data: {
        token: 'mock-jwt-token',
        user: newUser
      }
    };
  },

  login: async (credentials) => {
    await delay(1000);
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }
    return {
      data: {
        token: 'mock-jwt-token',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }
    };
  },

  getAllUsers: async () => {
    await delay(500);
    return { data: mockUsers };
  }
};

export const mockPropertyAPI = {
  getAllProperties: async () => {
    await delay(1000);
    return { data: mockProperties };
  },

  getPropertyById: async (id) => {
    await delay(500);
    const property = mockProperties.find(p => p._id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { data: property };
  },

  addProperty: async (propertyData, userId) => {
    await delay(1000);
    const newProperty = {
      _id: Date.now().toString(),
      ...propertyData,
      owner: userId,
      createdAt: new Date().toISOString()
    };
    mockProperties.push(newProperty);
    return { data: newProperty };
  },

  updateProperty: async (id, propertyData) => {
    await delay(1000);
    const index = mockProperties.findIndex(p => p._id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    mockProperties[index] = { ...mockProperties[index], ...propertyData };
    return { data: mockProperties[index] };
  },

  deleteProperty: async (id) => {
    await delay(500);
    const index = mockProperties.findIndex(p => p._id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    mockProperties.splice(index, 1);
    return { data: { message: 'Property deleted successfully' } };
  },

  getUserProperties: async (userId) => {
    await delay(500);
    const userProperties = mockProperties.filter(p => p.owner === userId);
    return { data: userProperties };
  }
};