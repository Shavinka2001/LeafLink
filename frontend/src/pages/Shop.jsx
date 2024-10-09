import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for opening/closing modal
  const [newItem, setNewItem] = useState({
    Itemname: '',
    Discription: '',
    quantity: '',
    price: '',
    image: '',
  });

  const navigate = useNavigate(); // Use React Router's useNavigate for navigation

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('item'); // Adjust the base URL as necessary
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load cart from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update local storage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Function to add items to cart
  const addToCart = (product) => {
    if (!cart.some((item) => item._id === product._id)) {
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  // Function to remove items from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Check if item is in cart
  const isInCart = (productId) => cart.some((item) => item._id === productId);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewItem({ Itemname: '', Discription: '', quantity: '', price: '', image: '' }); // Reset form
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.Itemname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>; // Loading state

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Container for the shop page */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Our Products</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-4 py-2"
          />
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              {/* Product Image */}
              <img src={product.image} alt={product.Itemname} className="h-56 w-full object-cover" />

              {/* Product Info */}
              <div className="p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.Itemname}</h2>
                <p className="text-gray-600 mb-2">{product.Discription}</p>
                <p className="text-lg font-bold text-green-700 mb-4">${product.price}</p>

                {/* Add to Cart Button */}
                {isInCart(product._id) ? (
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="mt-auto bg-red-600 text-white text-center py-2 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700 transition duration-300"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
//https://www.zestaceylontea.com/wp-content/uploads/2020/12/Untitled-design-2021-05-19T140403.519.jpg