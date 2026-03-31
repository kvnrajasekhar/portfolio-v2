import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Added for Client-Side Routing
import navLinks from "./Navlinks";
import {
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import darkLogo from "../../assets/portfolio-dark-logo.png";
import lightLogo from "../../assets/portfolio-light-logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6 flex justify-center ">
      <nav
        className="
        flex items-center justify-between
        w-[90%] max-w-6xl
        px-6 py-3
        border border-[#5cbdb9]/20
        dark:border-[#fbe3e8]/20
        rounded-full
        backdrop-blur-xl
        shadow-lg
        transition-colors duration-300
        "
      >
        {/* Logo - Changed <a> to <Link> */}
        <Link to="/" >
          <img
            src={isDark ? darkLogo : lightLogo}
            alt="Logo"
            width={38}
            height={38}
            className="inline-block mr-2"
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-3">
          {navLinks.map((nav, i) => (
            <li
              key={i}
              className="relative"
              onMouseEnter={() => setOpenDropdown(i)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {!nav.dropdown && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to={nav.link} // Changed 'href' to 'to'
                    className="
                    px-4 py-2 text-sm
                    text-[#5cbdb9] dark:text-[#fbe3e8]
                    hover:bg-[#fbe3e8] hover:text-[#262626] hover:drop-shadow-[0_0_1px_rgba(0,0,0,1)]
                    dark:hover:bg-[#5cbdb9] dark:hover:text-[#262626] dark:hover:drop-shadow-[0_0_1px_white]
                    rounded-full transition
                    "
                  >
                    {nav.name}
                  </Link>
                </motion.div>
              )}

              {nav.dropdown && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="
                    flex items-center gap-1
                    px-4 py-2 text-sm
                    text-[#5cbdb9] dark:text-[#fbe3e8] 
                    hover:bg-[#fbe3e8] hover:text-[#262626] 
                    dark:hover:bg-[#5cbdb9] dark:hover:text-[#262626]
                    rounded-full transition
                    "
                  >
                    {nav.name}

                    <motion.span
                      animate={{ rotate: openDropdown === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <FiChevronDown size={14} />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {openDropdown === i && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="
                        absolute top-12 right-0
                        w-44
                        backdrop-blur-xl
                        border border-[#5cbdb9]/20
                        rounded-xl
                        shadow-xl
                        p-2
                        "
                      >
                        {nav.dropdown.map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={item.link} // Changed 'href' to 'to'
                              className="
                              block px-3 py-2 rounded-lg text-sm
                              text-[#5cbdb9] dark:text-[#fbe3e8]
                              hover:bg-[#fbe3e8] hover:text-[#262626] hover:drop-shadow-[0_0_1px_rgba(0,0,0,1)]
                              dark:hover:bg-[#5cbdb9] dark:hover:text-[#262626] dark:hover:drop-shadow-[0_0_1px_white]
                              transition
                              "
                            >
                              {item.name}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-xl text-[#5cbdb9] dark:text-[#fbe3e8] hover:scale-110 transition"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          <button
            className="md:hidden text-xl text-[#5cbdb9] dark:text-[#fbe3e8]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
            absolute top-24
            w-[90%]
            bg-white/90 dark:bg-[#262626]/90
            backdrop-blur-xl
            rounded-2xl
            p-6 md:hidden
            "
          >
            <ul className="flex flex-col gap-6 text-center">
              {navLinks.map((nav, i) => (
                <li key={i}>
                  {!nav.dropdown ? (
                    <Link
                      to={nav.link} // Changed 'href' to 'to'
                      onClick={() => setMenuOpen(false)}
                      className="text-[#5cbdb9] dark:text-[#fbe3e8] text-lg block"
                    >
                      {nav.name}
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          setMobileMoreOpen(!mobileMoreOpen)
                        }
                        className="flex items-center justify-center gap-2 text-lg font-semibold text-[#5cbdb9] dark:text-[#fbe3e8]"
                      >
                        {nav.name}
                        <motion.span
                          animate={{
                            rotate: mobileMoreOpen ? 180 : 0,
                          }}
                        >
                          <FiChevronDown />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {mobileMoreOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-3 overflow-hidden"
                          >
                            {nav.dropdown.map((item, index) => (
                              <Link
                                key={index}
                                to={item.link} // Changed 'href' to 'to'
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileMoreOpen(false);
                                }}
                                className="text-[#5cbdb9] dark:text-[#fbe3e8] opacity-80 hover:opacity-100"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;