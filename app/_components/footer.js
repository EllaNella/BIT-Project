import React from "react";
import Image from "next/image";
import styles from "./components.module.css";
const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>2024 - EcoGo, Inc. All rights reserved.</p>
      <div className={styles.socials}>
        <Image src={"/icons/FB.png"} width={35} height={20} alt="facebook" />
        <p>|</p>
        <Image src={"/icons/IG.png"} width={20} height={20} alt="facebook" />
        <p>|</p>
        <Image src={"/icons/X.png"} width={35} height={20} alt="facebook" />
      </div>
    </div>
  );
};

export default Footer;
