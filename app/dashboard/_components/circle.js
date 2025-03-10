import React from "react";
import Link from "next/link";
import styles from "../page.module.css";
import Image from "next/image";

export const Circle = ({ tagline, page, image }) => {
  return (
    <Link href={page}>
      <div className={styles.circle}>
        <Image
          className={styles.image}
          src={image} // Use the passed image prop
          height={600} // Set height to 0 to maintain aspect ratio
          width={600} // Set width to 0 to maintain aspect ratio
          
          alt={tagline} // Set alt based on tagline
        />
        <h4>{tagline}</h4>
      </div>
    </Link>
  );
};
