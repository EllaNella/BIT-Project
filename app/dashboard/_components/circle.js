import React from "react";

import styles from "../page.module.css";

export const Circle = ({ tagline }) => {
  return (
    <div className={styles.circle}>
      <div className={styles.image}>
        <p>image</p>
      </div>
      <h4>{tagline}</h4>
    </div>
  );
};
