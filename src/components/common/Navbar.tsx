import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { themeMode, toggleTheme } = useTheme();
  const location = useLocation(); // Get current location
  const isHomePage = location.pathname === '/'; // Check if it's the homepage

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll(); // Check scroll position on initial load
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Produk", path: "/products" },
    { name: "Tentang Kami", path: "/about" },
    { name: "Galeri", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const baseLinkClasses =
    "relative font-medium transition-colors duration-300 ease-in-out group py-1";
  const scrolledOrNotHomeLinkClasses = // Styles for when scrolled OR not on homepage
    "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400";
  const topHomeLinkClasses = // Styles for when at the top of the homepage
    "text-white dark:text-white hover:text-white dark:hover:text-white";
  const activeLinkClasses = "text-red-600 dark:text-red-400"; // Active state color remains red

  const underlineClasses =
    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 group-hover:after:w-full";

  // Function to determine link classes based on active state, scroll state, and current page
  const getLinkClassName = ({ isActive }: { isActive: boolean }): string => {
    let linkColorClasses = "";

    if (isActive) {
      // Active links always use the active color and style
      linkColorClasses = activeLinkClasses + " after:w-full font-semibold";
    } else {
      // Inactive links depend on scroll state AND if on the homepage
      if (isScrolled || !isHomePage) {
        // Use scrolled/darker text colors if scrolled OR NOT on the homepage
        linkColorClasses = scrolledOrNotHomeLinkClasses;
      } else {
        // Use top/lighter text colors only if at the top AND on the homepage
        linkColorClasses = topHomeLinkClasses;
      }
    }
    return `${baseLinkClasses} ${underlineClasses} ${linkColorClasses}`;
  };

  // Determine logo text color based on scroll or if not on homepage
  const logoTextColorClass =
    isScrolled || !isHomePage
      ? "text-gray-900 dark:text-white" // Darker text if scrolled or not homepage
      : "text-white"; // Lighter text only at top of homepage

  // Determine button color based on scroll or if not on homepage
  const buttonColorClasses = (isThemeButton: boolean = false) => {
    if (isScrolled || !isHomePage) {
      // Scrolled or Not Homepage colors
      return isThemeButton
        ? "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:ring-red-500 dark:focus:ring-offset-gray-950"
        : "text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-red-500 dark:focus:ring-offset-gray-950"; // Hamburger uses slightly different text color
    } else {
      // Top of Homepage colors
      return "text-white hover:bg-white/20 dark:text-white dark:hover:bg-white/20 focus:ring-white focus:ring-offset-black/20";
    }
  };

  // Determine Navbar background based on scroll or if not on homepage
  const navBackgroundClass =
    isScrolled || !isHomePage
      ? "bg-white dark:bg-gray-950 shadow-md py-3" // Solid background if scrolled or not homepage
      : "bg-transparent backdrop-blur-sm py-4"; // Transparent only at top of homepage

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${navBackgroundClass}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          <img
            src="/img/logo.png"
            alt="ATSAKA Logo" // Added alt text
            className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
          />
          <span
            className={`text-2xl font-semibold transition-colors duration-300 ${logoTextColorClass}`}
          >
            ATSAKA
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-7 lg:space-x-9">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={getLinkClassName} // Use the function to get classes
              end={link.path === "/"} // Ensure exact match for homepage
            >
              {link.name}
            </NavLink>
          ))}
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClasses(
              true
            )}`}
            aria-label={
              themeMode === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {themeMode === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Theme Toggle Button (Mobile) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClasses(
              true
            )}`}
            aria-label={
              themeMode === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {themeMode === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-md transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClasses(
              false
            )}`}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg transition-all duration-300 ease-out md:hidden origin-top ${
          isMenuOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-95 invisible"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={`mobile-${link.name}`}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
                }`
              }
              onClick={() => setIsMenuOpen(false)} // Close menu on click
              end={link.path === "/"} // Ensure exact match for homepage
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
