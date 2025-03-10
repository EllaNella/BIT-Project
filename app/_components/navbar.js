import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./components.module.css";
import IconButton from "./icon.button";

const Navbar = ({ onClick, onThemeToggle, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY === 0) {
      setIsVisible(true); // Show navbar at the top of the page
    } else {
      setIsVisible(false); // Hide navbar when scrolling
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${styles.navbar} ${isDarkMode ? styles.dark : ""} ${
        isVisible ? "" : styles.hidden
      }`}
    >
      <Link href="/">
        <Image
          src={"/icons/WebsiteLogo.png"}
          width={70}
          height={70}
          alt="Logo"
          className={styles.logo}
        />
      </Link>

      <div className={styles.navItems}>
        <IconButton icon="/icons/NavButton.png" onClick={onClick} />
      </div>

      <p className={styles.ecoText}>EcoGos</p>
    </div>
  );
};

export default Navbar;
