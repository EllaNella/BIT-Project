import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./components.module.css";
import IconButton from "./icon.button";

const Navbar = ({ onClick, onThemeToggle, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className={`${styles.navbar} ${isDarkMode ? styles.dark : ""}`}>
      <Link href="/">
        <Image
          src={"/icons/WebsiteLogo.png"}
          width={65}
          height={65}
          alt="Logo"
          className={styles.logo}
        />
      </Link>

      {/* Large screen items */}
      <div className={styles.navItems}>
      

        <IconButton icon="/icons/NavButton.png" onClick={onClick} />
      </div>

      {/* EcoGo text centered */}
      <p className={styles.ecoText}>EcoGo</p>

      {/* Hamburger for all devices */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/">Dashboard</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
