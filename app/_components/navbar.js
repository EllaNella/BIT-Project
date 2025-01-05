import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./components.module.css";
import IconButton from "./icon.button";
const Navbar = ({ onClick }) => {
  return (
    <div className={styles.navbar}>
      <Link href="/dashboard">
        <Image
          src={"/icons/WebsiteLogo.png"}
          width={50}
          height={50}
          alt="Logo"
        />
      </Link>
      <p>EcoGo</p>
      <IconButton icon="/icons/NavButton.png" onClick={onClick} />
    </div>
  );
};

export default Navbar;
