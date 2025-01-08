import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { GiArtificialIntelligence } from "react-icons/gi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="relative">
      <div className="flex justify-between p-4 md:p-6 md:mx-24 items-center ">
        <div className="flex justify-between w-[300px] items-center">
          <div className="flex items-center">
            <GiArtificialIntelligence className="text-4xl text-blue-600" />
            <h1 className="text-2xl font-semibold  ">TextTidy</h1>
          </div>
          <div className="space-x-10 ml-24 hidden lg:flex items-center ">
            <Link>Products</Link>
            <Link>Pricing</Link>
            <Link>Resources</Link>
          </div>
        </div>
        <div className="space-x-10 hidden lg:flex">
          <Link className="bg-gray-300 py-2 px-4" to="/sign-in">
            Sign In
          </Link>
          <button className="bg-blue-600 py-2 px-4 text-white">
            Get Started
          </button>
        </div>
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {/* Mobile */}

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 space-y-4">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="hover:text-blue-600">
              Products
            </Link>
            <Link to="/" className="hover:text-blue-600">
              Pricing
            </Link>
            <Link to="/" className="hover:text-blue-600">
              Resources
            </Link>
          </div>
          <div className="flex flex-col space-y-2 pt-4 border-t">
            <button className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 transition-colors">
              Sign In
            </button>
            <button className="bg-blue-600 py-2 px-4 text-white rounded hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
