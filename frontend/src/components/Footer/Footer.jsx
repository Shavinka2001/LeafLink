import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // List of routes where the footer should NOT be displayed
  const hiddenRoutes = ["/ManagerProfile"];

  // Check if the current path is one of the hidden routes
  const shouldDisplayFooter = !hiddenRoutes.includes(location.pathname);

  return (
    shouldDisplayFooter && ( // Only render the footer if not on hidden routes
      <footer className="bg-green-800 text-white py-8">
        <div className="md:px-32 px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Company Branding */}
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">LeafLink</h2>
              <p className="text-sm">
                Bringing you the finest tea varieties, directly from our tea factory to your cup.
              </p>
            </div>

            {/* Social Media Links */}
            <ul className="flex space-x-4">
              <li>
                <Link to="#" className="hover:text-white" aria-label="Facebook">
                  <FaFacebook />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white" aria-label="Twitter">
                  <FaTwitter />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white" aria-label="Instagram">
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white" aria-label="LinkedIn">
                  <FaLinkedin />
                </Link>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <hr className="border-green-900 my-4" />

          {/* Footer Copyright */}
          <p className="text-sm text-center">
            © {new Date().getFullYear()} LeafLink. All rights reserved.
          </p>
        </div>
      </footer>
    )
  );
};

export default Footer;
