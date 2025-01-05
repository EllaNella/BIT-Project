"use client";

import Image from "next/image";
import styles from "./components.module.css";

export default function IconButton({ icon, onClick, width = 30, height = 30 }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <Image
        // className={styles.image}
        src={icon} // Route of the image file
        height={width} // Desired size with correct aspect ratio
        width={height}
        alt="icon"
      />
    </button>
  );
}
