import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import navLinks from "./Navlinks";
import {
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6 flex justify-center">
      <nav
        className="
        flex items-center justify-between
        w-[90%] max-w-6xl
        px-6 py-3
        border border-black/20 dark:border-white/20
        rounded-full
        backdrop-blur-xl
        bg-white/60 dark:bg-black/60
        shadow-lg
        transition-colors duration-300
        "
      >
        {/* Logo */}
        <h1 className="text-black dark:text-white font-semibold text-lg tracking-wide">
          Raja
        </h1>

        {/* Desktop Links */}
       <ul className="hidden md:flex items-center gap-3">
      {navLinks.map((nav, i) => (
        <li
          key={i}
          className="relative"
          onMouseEnter={() => setOpenDropdown(i)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {/* NORMAL LINK */}
          {!nav.dropdown && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={nav.link}
              className="
              px-4 py-2 text-sm
              text-black/80 dark:text-white/80
              hover:text-white hover:bg-black/80
              dark:hover:bg-white dark:hover:text-black
              rounded-full transition
              "
            >
              {nav.name}
            </motion.a>
          )}

          {/* DROPDOWN BUTTON */}
          {nav.dropdown && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="
                flex items-center gap-1
                px-4 py-2 text-sm
                text-black/80 dark:text-white/80
                hover:text-white hover:bg-black/80
                dark:hover:bg-white dark:hover:text-black
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

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {openDropdown === i && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="
                    absolute top-12 right-0
                    w-44
                    bg-white/70 dark:bg-black/70
                    backdrop-blur-xl
                    border border-black/10 dark:border-white/10
                    rounded-xl
                    shadow-xl
                    p-2
                    origin-top
                    "
                  >
                    {nav.dropdown.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <a
                          href={item.link}
                          className="
                          block px-3 py-2 rounded-lg text-sm
                          text-black/80 dark:text-white/80
                          hover:bg-black/90 hover:text-white
                          dark:hover:bg-white/90 dark:hover:text-black
                          transition
                          "
                        >
                          {item.name}
                        </a>
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
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
            text-xl
            text-black dark:text-white
            hover:scale-110
            transition
            "
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {/* Mobile Menu */}
          <button
            className="md:hidden text-xl text-black dark:text-white"
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
            absolute
            top-24
            w-[90%]
            bg-white/80 dark:bg-black/70
            backdrop-blur-xl
            border border-black/10 dark:border-white/10
            rounded-2xl
            shadow-xl
            p-6
            md:hidden
            "
          >
            <ul className="flex flex-col gap-6 text-center">
              {navLinks.map((nav, i) => (
                <li key={i}>
                  {!nav.dropdown ? (
                    <a
                      href={nav.link}
                      onClick={() => setMenuOpen(false)}
                      className="
                      text-black dark:text-white
                      text-lg
                      hover:opacity-70
                      px-4 py-2 rounded-full transition
                      "
                    >
                      {nav.name}
                    </a>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          setMobileMoreOpen(!mobileMoreOpen)
                        }
                        className="
                        flex items-center justify-center gap-2
                        text-black dark:text-white
                        text-lg font-semibold
                        "
                      >
                        {nav.name}

                        <motion.span
                          animate={{
                            rotate: mobileMoreOpen ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
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
                            className="flex flex-col gap-3"
                          >
                            {nav.dropdown.map((item, index) => (
                              <a
                                key={index}
                                href={item.link}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileMoreOpen(false);
                                }}
                                className="
                                text-black/80 dark:text-white/80
                                hover:opacity-70
                                px-4 py-2 rounded-full
                                transition
                                "
                              >
                                {item.name}
                              </a>
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