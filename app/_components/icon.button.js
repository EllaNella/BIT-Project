"use client";

import Image from "next/image";
import styles from "./components.module.css";

export default function IconButton({ icon, onClick, width = 50, height = 50 }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <Image // Hamburger and Close button (Universal CSS)
        src={icon} // Route of the image file
        height={width} // Desired size with correct aspect ratio
        width={height}
        alt="icon"
      />
    </button>
  );
}
