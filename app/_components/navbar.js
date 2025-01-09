// Navbar Component
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./components.module.css";
import IconButton from "./icon.button";

const Navbar = ({ onClick, onThemeToggle, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setIsVisible(false); // Scrolling down, hide navbar
    } else {
      setIsVisible(true); // Scrolling up, show navbar
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`${styles.navbar} ${isDarkMode ? styles.dark : ""} ${
        isVisible ? "" : styles.hidden
      }`}
    >
      <Link href="/">
        <Image
          src={"/icons/WebsiteLogo.png"}
          width={50}
          height={50}
          alt="Logo"
          className={styles.logo}
        />
      </Link>

      <div className={styles.navItems}>
        <IconButton icon="/icons/NavButton.png" onClick={onClick} />
      </div>

      <p className={styles.ecoText}>EcoGo</p>
    </div>
  );
};

export default Navbar;