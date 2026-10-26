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
    {
      name: "Pompa Pemadam",
      path: "/products?category=pompa",
      subLinks: [
        { name: "Mini Pump", path: "/products?category=pompa-mini" },
        { name: "Middle Pump", path: "/products?category=pompa-middle" },
        { name: "Master Pump", path: "/products?category=pompa-master" },
        { name: "Floating Pump", path: "/products?category=pompa-floating" },
      ]
    },
    { name: "Kelengkapan Pemadam", path: "/products?category=aksesoris" },
    { name: "Tentang Kami", path: "/company" },
  ];

  // Navbar always sits on a dark bar (DJI-style reference), so links are light
  const baseLinkClasses =
    "relative text-[15px] font-normal transition-colors duration-300 ease-in-out group py-1";
  const scrolledOrNotHomeLinkClasses = // Styles for when scrolled OR not on homepage
    "text-gray-200 hover:text-white";
  const topHomeLinkClasses = // Styles for when at the top of the homepage
    "text-white hover:text-white";
  const activeLinkClasses = "text-white"; // Active state marked by the red underline

  const underlineClasses =
    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 group-hover:after:w-full";

  // NavLink ignores the query string, so links like /products?category=x need an extra check
  const matchesQuery = (path: string) => {
    const query = path.split("?")[1];
    return !query || location.search === `?${query}`;
  };

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

  const logoTextColorClass = "text-white";

  const buttonColorClasses =
    "text-white hover:bg-white/15 focus:ring-white/60 focus:ring-offset-transparent";

  // Determine Navbar background based on scroll or if not on homepage
  const navBackgroundClass =
    isScrolled || !isHomePage
      ? "bg-[#14151f]/95 backdrop-blur-md shadow-lg py-2" // Solid dark bar if scrolled or not homepage
      : "bg-transparent py-4"; // Transparent only at top of homepage

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
          <span className="flex flex-col leading-none">
            <span
              className={`text-2xl font-bold tracking-[0.12em] transition-colors duration-300 ${logoTextColorClass}`}
            >
              ATSAKA
            </span>
            <span className="mt-1 text-[9px] font-medium tracking-[0.25em] uppercase text-gray-300">
              Kuat · Kuasa · Merdeka
            </span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
          {navLinks.map((link) => {
            const isHashLink = link.path.startsWith('/#');
            const hasSubLinks = 'subLinks' in link && link.subLinks;

            if (hasSubLinks) {
              return (
                <div key={link.name} className="relative group">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `${getLinkClassName({
                        isActive:
                          isActive &&
                          (matchesQuery(link.path) ||
                            !!link.subLinks?.some((sub) => matchesQuery(sub.path))),
                      })} flex items-center gap-1`
                    }
                  >
                    {link.name}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                  </NavLink>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                   <div className="w-52 py-2 bg-[#222222] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                    {link.subLinks?.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block px-6 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-red-400 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                   </div>
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
                className={({ isActive }) =>
                  getLinkClassName({ isActive: isActive && matchesQuery(link.path) })
                }
                end={link.path === "/"}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClasses}`}
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
          <Link
            to="/contact"
            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Hubungi Kami
          </Link>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex items-center space-x-2 lg:hidden">
          {/* Theme Toggle Button (Mobile) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClasses}`}
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
            className={`p-2 rounded-md transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClasses}`}
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
        className={`absolute top-full left-0 w-full max-h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-950 shadow-2xl transition-all duration-300 ease-out lg:hidden origin-top border-t border-gray-100 dark:border-gray-800 ${
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
                        isActive && matchesQuery(link.path)
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
                        onClick={() => setIsMenuOpen(false)}
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
