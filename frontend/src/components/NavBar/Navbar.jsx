import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import AuthModal from "../AuthModel/AuthModel";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import Logo2 from "../../assets/images/Logo2.png";

const Navbar = () => {

  const location = useLocation();

  // List of routes where the footer should NOT be displayed
  const hiddenRoutes = ["/ManagerProfile"];

  // Check if the current path is one of the hidden routes
  const shouldDisplayFooter = !hiddenRoutes.includes(location.pathname);

  const { user, logout } = useAuth();
  const [nav, setNav] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [cartItems, setCartItems] = useState(); // Replace with actual cart data

  console.log(cartItems);
  

  useEffect(() => {
    // Function to calculate the total item count from localStorage
    const storedCartItems = localStorage.getItem('cart');
    
    if (storedCartItems) {
      // Parse storedCartItems as an array and get its length
      setCartItems(JSON.parse(storedCartItems).length);
    } else {
      // If there are no items in the cart, set count to 0
      setCartItems(0);
    }
  }, []);

  const handleNav = () => setNav(!nav);
  const handleLoginModal = () => {
    setShowLogin(true);
    setShowRegister(false); // Close register modal
  };
  const handleRegisterModal = () => {
    setShowRegister(true);
    setShowLogin(false); // Close login modal
  };
  const handleCloseModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowProfileModal(false);
  };

  return (
    shouldDisplayFooter && (<nav className="flex justify-between w-full py-4 lg:px-32 px-12 sticky top-0 z-[999] bg-green-800 text-white">
      {/* Logo and Text for Large Screens */}
      <div className="items-center hidden lg:flex">
        {/* Add the logo before the "LeafLink" text */}
        <Link to="/" className="flex items-center text-2xl font-bold cursor-pointer text-white">
          <img src={Logo2} alt="Logo" className="h-10 w-10 mr-2 -mt-1"/> 
          LeafLink
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="items-center hidden space-x-12 lg:flex text-white">
        <Link to="/shop" className="hover:text-green-300 transition">
          Products
        </Link>
        <Link to="/about" className="hover:text-green-300 transition">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-green-300 transition">
          Contact
        </Link>
      </div>

      {/* Auth Links, Cart Button, or User Profile Button */}
      <div className="items-center hidden gap-8 lg:flex">
        {/* Cart Button */}
        <div className="relative cursor-pointer">
          <Link to="/cart">
            <AiOutlineShoppingCart size={30} className="text-white" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
                {cartItems}
              </span>
            )}
          </Link>
        </div>

        {user ? (
          <button
            onClick={() => setShowProfileModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-green-600 shadow-sm transition-all duration-150 hover:bg-gray-200"
          >
            <AiOutlineUser />
            {user.name}
          </button>
        ) : (
          <>
            <button
              onClick={handleLoginModal}
              className="text-white hover:text-green-300 transition"
            >
              Login
            </button>
            <button
              onClick={handleRegisterModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-600"
            >
              Join for Free
            </button>
          </>
        )}
      </div>

      {/* Login Modal */}
      <AuthModal isOpen={showLogin} onClose={handleCloseModal} mode="login" />

      {/* Register Modal */}
      <AuthModal isOpen={showRegister} onClose={handleCloseModal} mode="register" />

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={handleCloseModal}
          logout={logout}
        />
      )}

      {/* Mobile Navigation */}
      <div onClick={handleNav} className="flex items-center justify-center lg:hidden">
        {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
      </div>

      {/* Mobile Navigation Content */}
      <div
        className={
          !nav
            ? "fixed left-[-100%] top-0 w-[60%] h-full bg-green-600 text-white ease-in-out duration-500 lg:hidden shadow"
            : "fixed left-0 top-0 w-[60%] h-full ease-in-out bg-green-600 text-white duration-500 lg:hidden shadow"
        }
      >
        <h1 className="font-bold m-8 text-white">
          <Link
            to="/"
            onClick={() => setNav(false)}
          >
            LeafLink
          </Link>
        </h1>

        {/* Sign In and Sign Up buttons */}
        <div className="flex flex-col mx-5">
          {user ? (
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex mt-8 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-green-600 shadow-sm transition-all duration-150 hover:bg-gray-200"
            >
              <AiOutlineUser />
              {user.name}
            </button>
          ) : (
            <>
              <button
                onClick={handleLoginModal}
                className="mt-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium bg-green-600 hover:bg-green-600 focus:outline-none"
              >
                Sign In
              </button>
              <button
                onClick={handleRegisterModal}
                className="mt-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium bg-green-600 hover:bg-green-600 focus:outline-none"
              >
                Sign Up for Free
              </button>
            </>
          )}
        </div>
      </div>
    </nav>)
    
  );
};

export default Navbar;
