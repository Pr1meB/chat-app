import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Menu, X } from "lucide-react"; // Icons for menu toggle

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`bg-white px-4 py-2 shadow-md w-full z-50 h-14 fixed top-0 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center h-full">
          {/* Logo / Brand */}
          <Link to="/" className="text-xl font-bold text-gray-800">Chatie</Link>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <Menu size={24} className="text-gray-800" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <img 
                    src="https://avatar.iran.liara.run/public" 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-800">{user.username}</span>
                </div>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link to="/signup" className="text-gray-800 hover:text-gray-600">Sign Up</Link>
                <Link to="/login" className="text-gray-800 hover:text-gray-600">Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Push content down so it doesn't get hidden behind navbar */}
      <div className="mt-14">
        {/* Main content goes here */}
      </div>

      {/* Off-Canvas Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white text-black shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex flex-col space-y-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <img 
                  src="https://avatar.iran.liara.run/public" 
                  alt="avatar" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-800">{user.username}</span>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link to="/signup" className="text-gray-800 hover:text-gray-600">Sign Up</Link>
              <Link to="/login" className="text-gray-800 hover:text-gray-600">Login</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
