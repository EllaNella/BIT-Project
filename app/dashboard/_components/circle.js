import React from "react";
import Link from "next/link";
import styles from "../page.module.css";
import Image from "next/image";

export const Circle = ({ tagline, page }) => {
  return (
    <Link href={page}>
      <div className={styles.circle}>
        <Image
          className={styles.image}
          src="/images/Image.jpeg" // Route of the image file
          height={200} // Desired size with correct aspect ratio
          width={200}
          alt="Your Name"
        />
        <h4>{tagline}</h4>
      </div>
    </Link>
  );
};
