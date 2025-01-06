import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Import icons
import styles from "./components.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <h2>EcoGo</h2>
      <p>&copy; 2025 EcoGo. All Rights Reserved.</p>
      <div className={styles.socials}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={30} /> {/* Adjust the size */} |
        </a>
        
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={30} /> |
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={30} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
