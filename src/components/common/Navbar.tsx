import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
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
    { 
      name: "Company", 
      path: "/company",
      subLinks: [
        { name: "About Us", path: "/company#about" },
        { name: "History", path: "/company#history" },
        { name: "Certificates", path: "/company#certificates" },
        { name: "Customer", path: "/company#customer" },
      ]
    },
    { name: "Artikel", path: "/articles" },
    { name: "Kontak", path: "/contact" },
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
          {navLinks.map((link) => {
            const isHashLink = link.path.startsWith('/#');
            const hasSubLinks = 'subLinks' in link && link.subLinks;

            if (hasSubLinks) {
              return (
                <div key={link.name} className="relative group">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `${getLinkClassName({ isActive })} flex items-center gap-1`}
                  >
                    {link.name}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                  </NavLink>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                    {link.subLinks?.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        onClick={() => {
                          if (location.pathname === '/company' && sub.path.includes('#')) {
                            const targetId = sub.path.split('#')[1];
                            const element = document.getElementById(targetId);
                            if (element) {
                              const top = element.getBoundingClientRect().top + window.scrollY - 80;
                              window.scrollTo({ top, behavior: 'smooth' });
                              window.history.pushState(null, '', sub.path);
                            }
                          }
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return isHashLink ? (
              <a
                key={link.name}
                href={link.path}
                className={getLinkClassName({ isActive: false })}
                onClick={() => {
                  if (location.pathname === '/') {
                    const targetId = link.path.substring(2);
                    const element = document.getElementById(targetId);
                    if (element) {
                      const top = element.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                      window.history.pushState(null, '', link.path);
                    }
                  }
                }}
              >
                {link.name}
              </a>
            ) : (
              <NavLink
                key={link.name}
                to={link.path}
                className={getLinkClassName}
                end={link.path === "/"}
                onClick={() => {
                  if (link.name === "Produk" && location.pathname === "/products") {
                    // Force a "refresh" of the products page state if already there
                    if (location.search !== "") {
                      // Navigate to /products without query params
                    }
                  }
                }}
              >
                {link.name}
              </NavLink>
            );
          })}
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
        className={`absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-2xl transition-all duration-300 ease-out md:hidden origin-top border-t border-gray-100 dark:border-gray-800 ${
          isMenuOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-95 invisible"
        }`}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col space-y-2">
          {navLinks.map((link) => {
            const isHashLink = link.path.startsWith('/#');
            const hasSubLinks = 'subLinks' in link && link.subLinks;

            return (
              <div key={`mobile-${link.name}`} className="flex flex-col">
                {isHashLink ? (
                  <a
                    href={link.path}
                    className="flex items-center px-4 py-4 rounded-xl text-base font-bold transition-all duration-200 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (location.pathname === '/') {
                        const targetId = link.path.substring(2);
                        const element = document.getElementById(targetId);
                        if (element) {
                          const top = element.getBoundingClientRect().top + window.scrollY - 80;
                          window.scrollTo({ top, behavior: 'smooth' });
                          window.history.pushState(null, '', link.path);
                        }
                      }
                    }}
                  >
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-4 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-red-600 dark:hover:text-red-400"
                      }`
                    }
                    onClick={() => !hasSubLinks && setIsMenuOpen(false)}
                    end={link.path === "/"}
                  >
                    {link.name}
                    {hasSubLinks && <ChevronDown size={16} className="ml-auto" />}
                  </NavLink>
                )}

                {hasSubLinks && (
                  <div className="pl-6 flex flex-col space-y-1 mt-1">
                    {link.subLinks?.map((sub) => (
                      <Link
                        key={`mobile-sub-${sub.name}`}
                        to={sub.path}
                        className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-red-600 dark:hover:text-red-400 transition-all"
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (location.pathname === '/company' && sub.path.includes('#')) {
                            const targetId = sub.path.split('#')[1];
                            const element = document.getElementById(targetId);
                            if (element) {
                              const top = element.getBoundingClientRect().top + window.scrollY - 80;
                              window.scrollTo({ top, behavior: 'smooth' });
                              window.history.pushState(null, '', sub.path);
                            }
                          }
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile CTA */}
          <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
