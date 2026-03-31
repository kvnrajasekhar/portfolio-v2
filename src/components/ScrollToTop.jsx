import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 400); // Adjust this delay to match your shutter's midpoint
    return () => clearTimeout(timeout);
  }, [pathname]); // Triggers every time the URL path changes

  return null; 
};

export default ScrollToTop;