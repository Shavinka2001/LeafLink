import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cart');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems).map(item => ({ ...item, quantity: 1 })));
    }
  }, []);

  const incrementQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const decrementQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const updateLocalStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle checkout by navigating to the Payment page and passing state
  const handleCheckout = () => {
    navigate('/Payment', { state: { totalPrice, cartItems } });
  };

  return (
    <div className="container mx-auto my-10 p-5 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-lg font-medium">Total Items: {totalItems}</p>
            <p className="text-lg font-medium">Total Price: ${totalPrice}</p>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center p-4 border rounded-lg shadow-md">
                <img src={item.image} alt={item.Itemname} className="w-24 h-24 rounded-lg object-cover mr-4" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.Itemname}</h2>
                  <p className="text-gray-600">{item.Discription}</p>
                  <p className="text-lg font-medium mt-2">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrementQuantity(item._id)}
                    className="px-4 py-2 text-lg font-bold bg-gray-200 rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item._id)}
                    className="px-4 py-2 text-lg font-bold bg-gray-200 rounded-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="ml-4 px-4 py-2 text-red-600 font-bold border border-red-600 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={clearCart}
              className="px-6 py-2 text-white bg-red-600 rounded-lg font-bold hover:bg-red-700"
            >
              Remove All Items
            </button>

            <button
              onClick={handleCheckout}
              className="px-6 py-2 text-white bg-green-600 rounded-lg font-bold hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
