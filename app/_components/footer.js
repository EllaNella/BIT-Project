import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Import icons
import styles from "./components.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>&copy; 2025 EcoGo. All Rights Reserved.</p>
      <div className={styles.socials}>
      <a href="#" target="_blank" >
          <FaInstagram size={30} />
        </a>
          <span>|</span>
        
        <a href="#" target="_blank" >
          <FaTwitter size={30} />
         
        </a>
        <span>|</span>
        
        <a href="#" target="_blank" >
          <FaFacebook size={30} /> 
        </a>
      </div>
    </div>
  );
};

export default Footer;
