import React from "react";
import { Link as Scroll } from "react-scroll";
import ab3 from "../../assets/images/ab3.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background image */}
      <img
        src={ab3} // Replace with the actual path to your image
        alt="Tea Factory"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black opacity-50"></div>

      <div className="flex h-screen items-center justify-center p-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome to LeafLink - The Finest Tea Collection
          </h1>
          <h2 className="mt-6 text-lg leading-8 text-gray-300">
            Discover the rich flavors and premium quality of our hand-picked
            teas, directly from our factory to your cup.
          </h2>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              to="/shop"
              spy={true}
              smooth={true}
              duration={500}
            >
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 9.293a1 1 0 011.414 0L10 14.586l5.293-5.293a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
