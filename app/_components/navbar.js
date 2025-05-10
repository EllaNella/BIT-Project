import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./components.module.css";
import IconButton from "./icon.button";

const Navbar = ({ onClick}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY === 0) {
      setIsVisible(true); // Show navbar at the top of the page
    } else {
      setIsVisible(false); // Hide navbar when scrolling
    }
  };


  // Effect to handle scroll event
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // function to show the navbar on the top of the page if its not hide it

    // and also to show the navbar when the user scrolls back to the top of the page
    //there are two styles for the navbar one is hidden and the other is shown
    <div
      className={`${styles.navbar} ${
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

      <p className={styles.ecoText}>EcoGo</p>
    </div>
  );
};

export default Navbar;
